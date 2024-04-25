import Message, { IMessageSchema } from "../models/Message";
import Room, { IRoomSchema } from "../models/Room";
import User from "../models/User";
import { io } from '../index';

import { Request, Response, NextFunction } from 'express';

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    const { roomId } = req.params;
    const { limit } = req.query;

    try {
        const room: IRoomSchema | null = await Room.findOne({ _id: roomId });

        if (!room) {
            res.status(400);
            throw new Error("Комната не найдена");
        }

        const messages: IMessageSchema[] = (await Message.find({ roomId })
            .populate({ path: 'senderId', select: 'name surname avatar status' })
            .sort({ createdAt: -1 })
            .limit(Number(limit))).reverse();
            
        return res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};

export const createMessage = async (req: Request, res: Response, next: NextFunction) => {

    const { text, roomId } = req.body;

    enum TypeFile {
        Text = 'text',
        Image = 'image',
        File = 'file'
    }

    let typeMessage: string;

    if (!req.file) {
        typeMessage = TypeFile.Text
    } else if (req.file?.mimetype.startsWith('image')) {
        typeMessage = TypeFile.Image
    } else {
        typeMessage = TypeFile.File
    }

    try {
        if (typeMessage === 'text' && !text.trim()) {
            res.status(400);
            throw new Error('Сообщение не может быть пустым');
        }

        const room: IRoomSchema | null = await Room.findOne({ _id: roomId });

        if (!room) {
            res.status(400);
            throw new Error("Комната не найдена");
        }

        if (!room.participants.includes(req.user?._id)) {
            res.status(401);
            throw new Error("Вы не можете писать в комнату, в которую не приглашены");
        }

        const message: IMessageSchema = await Message.create({
            roomId,
            text: text ? text.trim() : '',
            messageType: typeMessage,
            senderId: req.user?._id,
            content: req.file ? { 
                filename: req.file.filename, 
                size: req.file.size
            } : null
        });

        const lastMessage = req.file ? req.file.filename : text;

        await room.updateOne({
            $set: { lastMessage }
        });

        await message.populate(
            { path: 'senderId', select: 'name surname avatar status last_seen' }
        );

        const updatedRoom = await Room.findById(room._id)
        await updatedRoom?.populate({ path: 'participants', select: 'name surname avatar status last_seen' })

        await message.save();
        
        io.to(roomId).emit('message', message);
        io.emit('update-room', { room: updatedRoom });
        
        return res.status(201).json(message);
        
    } catch (error) {
        next(error);
    }
};