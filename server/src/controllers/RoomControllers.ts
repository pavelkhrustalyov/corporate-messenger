import Room, { IRoomSchema } from "../models/Room";
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import User from "../models/User";

export const getRooms = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const rooms: IRoomSchema[] = await Room.find({
            participants: { $in: [req.user?._id] } 
        });
        return res.status(200).json(rooms);
    } catch (error) {
        next(error);
    }
};

export const createPrivateRoom = async (req: Request, res: Response, next: NextFunction) => {
    const { type, lastMessage = "" } = req.body;
    const { recipientId } = req.params;

    if (recipientId === req.user?._id.toString()) {
        return res.status(400).json({ message: 'Вы не можете пригласить себя' });
    }

    const existingRoom = await Room.findOne({
        type: 'private',
        participants: { $all: [req.user?._id, recipientId] }
    });

    if (existingRoom) {
        return res.status(400).json({ message: 'Данный чат уже существует' });
    }

    try {
        const room = await Room.create({
            type,
            participants: [req.user?._id, recipientId],
            recipientId,
            lastMessage
        })

        return res.status(200).json(room);
    } catch (error) {
        next(error);
    }
};

export const createGroupRoom = async (req: Request, res: Response, next: NextFunction) => {
    const { type, title, lastMessage = "" } = req.body;

    try {
        const room = await Room.create({
            creator: req.user?._id,
            type,
            title,
            participants: [ req.user?._id ],
            imageGroup: 'default-group.jpg',
            lastMessage
        })

        return res.status(201).json(room);
    } catch (error) {
        next(error);
    }
};

export const deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
    const { roomId } = req.params;

    try {
        const room = await Room.findById(roomId);
        const user = req.user;

        if (!room) {
            res.status(404);
            throw new Error('Комната не найдена');
        }

        if (room.participants.length <= 1) {
            await room.deleteOne();
            return res.status(204).json({ message: "Чат успешно удален" });
        }

        await room.updateOne({
            $pull: { participants: user?._id }
        });

        return res.status(200).json({ message: "Вы вышли из чата" })

    } catch (error) {
        next(error);
    }
};

export const inviteToGroupRoom = async (req: Request, res: Response, next: NextFunction) => {
    const { roomId, participants } = req.body;

    try {
        const room = await Room.findOne({ _id: roomId });

        if (!room) {
            res.status(404);
            throw new Error('Комната не найдена');
        }

        if (String(room?.creator) !== String(req.user?._id)) {
            res.status(401);
            throw new Error('Права на приглашение есть только у создателя группы');
        }
        
        if (!Array.isArray(participants) || participants.length === 0) {
            res.status(400);
            throw new Error('Некорректный формат участников');
        }

        // Добавляем участников в комнату
        const result = await room.updateOne({ 
            $push: { participants: { $each: participants } } 
        });

        if (result.nModified === 0) {
            res.status(500);
            throw new Error('Не удалось пригласить участников');
        }

        return res.json({ message: 'Участники успешно приглашены в комнату' });

    } catch (error) {
        next(error);
    }
};

export const kickOutOfGroup = async (req: Request, res: Response, next: NextFunction) => {
    const { recipientId, roomId } = req.params;

    try {
        
        if (recipientId == req.user?._id.toString()) {
            res.status(400);
            throw new Error('Вы не можете добавить себя');
        }

        const recipientUser = await User.findOne({ _id: recipientId });
        const room = await Room.findOne({ _id: roomId });
       
        if (!recipientUser) {
            res.status(404);
            throw new Error('Пользователь не найден');
        }

        if (String(room?.creator) !== String(req.user?._id)) {
            res.status(401);
            throw new Error('Права на приглашение есть только у создателя группы');
        }

        if (!room) {
            res.status(404);
            throw new Error('Комната не найдена');
        }


    } catch (error) {
        next(error);
    }
};


// get room