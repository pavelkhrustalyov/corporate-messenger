import Message, { IMessageSchema } from "../models/Message";
import Room, { IRoomSchema } from "../models/Room";
import { io } from '../index';
import { join } from 'node:path';
import { unlink } from 'fs/promises';


import { Request, Response, NextFunction } from 'express';
import mongoose from "mongoose";

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
            .populate({
                path: 'repliedMessage.senderId',
                select: 'name surname'
            })
            .populate({
                path: 'repliedMessage',
                populate: {
                    path: 'messageId',
                    select: 'text content messageType content'
                }
            })
            .sort({ createdAt: -1 })
            .limit(Number(limit)))
            .reverse();

        return res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};

export const searchMessages = async (req: Request, res: Response, next: NextFunction) => {
    const { text } = req.query;
    const { roomId } = req.params;

    const room: IRoomSchema | null = await Room.findOne({ _id: roomId });

    if (!room) {
        res.status(400);
        throw new Error("Комната не найдена");
    }

    if (typeof text !== 'string') {
        throw new Error('Параметр "text" должен быть строкой.');
    }

    try {
        const messages: IMessageSchema[] = await Message.find({
            roomId,
            text: { $regex: new RegExp(text, "i") }
        })
            .populate({ path: 'senderId', select: 'name surname avatar status' })
            .sort({ createdAt: -1 })

        return res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};

export const createMessage = async (req: Request, res: Response, next: NextFunction) => {

    const { text, roomId, repliedMessage } = req.body;

    const parsedReplyMessage = repliedMessage ? JSON.parse(repliedMessage) : null;

    enum TypeFile {
        Text = 'text',
        Image = 'image',
        File = 'file',
        Voice = 'voice'
    }

    let typeMessage: string;

    if (req.file?.mimetype === 'audio/mp3') {
        typeMessage = TypeFile.Voice;
    } else if (!req.file) {
        typeMessage = TypeFile.Text;
    } else if (req.file?.mimetype.startsWith('image')) {
        typeMessage = TypeFile.Image;
    } else {
        typeMessage = TypeFile.File;
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
            repliedMessage: parsedReplyMessage
            ? { 
                senderId: new mongoose.Types.ObjectId(parsedReplyMessage.senderId),
                messageId: new mongoose.Types.ObjectId(parsedReplyMessage.messageId)
            }
            : null,
            content: req.file ? { 
                filename: req.file.filename,
                size: req.file.size
            } : null,
        });

        await room.updateOne({
            $set: { lastMessage: message },
            $push: { messages: message }
        });

        await message.populate(
            { path: 'senderId', select: 'name surname avatar status last_seen' }
        );

        await message.populate({ path: 'repliedMessage.senderId', select: 'name surname' });
        await message.populate({ path: 'repliedMessage.messageId', select: 'text content messageType content' });

        const updatedRoom = await Room.findById(room._id)
        await updatedRoom?.populate({ path: 'participants', select: 'name surname avatar status last_seen' })
        await updatedRoom?.populate({ path: 'messages', select: 'senderId isRead' });
        await updatedRoom?.populate({ path: "lastMessage", select: "senderId messageType content text" })

        await message.save();

        io.to(roomId).emit('message', {
            message,
            roomId,
        });

        io.emit('update-room', { room: updatedRoom });

        return res.status(201).json(message);
        
    } catch (error) {
        next(error);
    }
};

export const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
    const { messageId, senderId } = req.params;

    try {
        const message = await Message.findById(messageId);

        if (message?.senderId.toString() !== senderId) {
            res.status(401);
            throw new Error("Нельзя удалить чужое сообщение");
        }



        let path: string = "";

        switch (message.messageType) {
            case "file":
                path = join(__dirname, '../public/files');
                break;
            case "voice":
                path = join(__dirname, '../public/voices');
                break;
            case "image":
                path = join(__dirname, '../public/message_images');
                break;
            default:
                path = "";
                break;
        }


        const filename = message.content?.filename;

        await Message.deleteOne({ _id: messageId, senderId });
        if (path !== "") {
            await unlink(`${path}/${filename}`);
        }

        io.emit("delete-message", { senderId, messageId });
        return res.status(201).json({ senderId, messageId });

    } catch (error) {
        next(error);
    }
};

export const readMessages = async (req: Request, res: Response, next: NextFunction) => {
    const { roomId } = req.params;
    const { limit } = req.query;
    try {
        const room = await Room.findById(roomId);

        if (!room) {
            res.status(404);
            throw new Error('Чат не найден!');
        }

        await Message.updateMany(
            { roomId, senderId: { $ne: req.user?._id }, isRead: false },
            { isRead: true }
        );

        const updatedMessages: IMessageSchema[] = (await Message.find({ roomId })
            .populate({ path: 'senderId', select: 'name surname avatar status' })
            .populate({
                path: 'repliedMessage.senderId',
                select: 'name surname'
            })
            .populate({
                path: 'repliedMessage',
                populate: {
                    path: 'messageId',
                    select: 'text content messageType content'
                }
            })
            .sort({ createdAt: -1 })
            .limit(Number(limit)))

        const updatedRoom = await Room.findById(roomId)
            .populate({ path: 'participants', select: '_id name surname avatar status last_seen' })
            .populate({ path: 'creator', select: '_id name surname avatar status last_seen' })
            .populate({ path: 'lastMessage', select: 'senderId messageType content text' });

        io.to(roomId).emit('read-messages', {
            messages: updatedMessages,
            room: updatedRoom,
            userId: req.user?._id
        });

        return res.status(200).json(updatedMessages);
    } catch (error) {
        next(error);
    }
};