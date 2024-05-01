import Room, { IRoomSchema } from "../models/Room";
import { Request, Response, NextFunction } from 'express';
import User from "../models/User";
import { io } from "../index";

export const getRooms = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const rooms: IRoomSchema[] = await Room.find({
            participants: { $in: [req.user?._id] },
        })
        .populate({ path: 'participants', select: 'name surname avatar status last_seen' })
        return res.status(200).json(rooms);
    } catch (error) {
        next(error);
    }
};

export const getRoomById = async (req: Request, res: Response, next: NextFunction) => {
    const { roomId } = req.params;

    try {
        const room = await Room.findById(roomId)
        .populate({ path: 'participants', select: '_id name surname avatar status last_seen' });

        if (!room) {
            res.status(404);
            throw new Error('Чат не найден');
        }

        res.status(200).json(room);

    } catch (error) {
        next(error);
    }
}

export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
    const { type, title, users } = req.body;

    try {
        if (!users.length) {
            res.status(401);
            throw new Error("Выберите собеседника");
        }

        let room: IRoomSchema;

        if (type === "private") {
            if (users.length === 1) {
                const [ user ] = users;

                const existingRoom = await Room.findOne({
                    type: 'private',
                    participants: { $all: [ req.user?._id, user ] }
                });

                if (existingRoom) {
                    res.status(401);
                    throw new Error("Данный чат уже существует");
                }
                
                room = await Room.create({
                    type,
                    participants: [ req.user?._id, user ],
                    lastMessage: ""
                })
            } else {
                res.status(401);
                throw new Error("В приватном чате максимум 1 собеседник");
            }
        } else {
            if (!title) {
                res.status(401);
                throw new Error('Название группы обязательно!');
            }

            room = await Room.create({
                creator: req.user?._id,
                type,
                title,
                participants: [req.user?._id, ...users],
                lastMessage: "",
                imageGroup: 'default-group.png'
            })
        }

        await room.save();
        await room.populate({ path: "participants", select: "name surname avatar status" });
        io.emit("create-room", room);
        return res.status(201).json(room);

    } catch (error) {
        next(error);
    }
    
};

export const leaveRoom = async (req: Request, res: Response, next: NextFunction) => {
    const { roomId } = req.params;

    try {
        const room = await Room.findById(roomId);
        const user = req.user;

        if (!room) {
            res.status(404);
            throw new Error('Комната не найдена');
        }

        if (room.type === "private") {
            res.status(400);
            throw new Error("Нельзя выйти из приватного чата");
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
    const { roomId, participants }:
    { roomId: string, participants: string[] } = req.body;

    try {
        const room: IRoomSchema | null = await Room.findById(roomId);

        if (!room) {
            res.status(404);
            throw new Error('Комната не найдена');
        }

        if (room.type === "private") {
            res.status(400);
            throw new Error("Нельзя пригласить в приватный чат");
        }

        const existingParticipants = room.participants.map(p => p.toString());
        const filteredInviteUsers = participants.filter(p => !existingParticipants.includes(p));

        if (String(room?.creator) !== String(req.user?._id)) {
            res.status(401);
            throw new Error('Права на приглашение есть только у создателя группы');
        }
        
        if (!Array.isArray(filteredInviteUsers) || filteredInviteUsers.length === 0) {
            res.status(400);
            throw new Error('Некорректный формат участников');
        }

        const result = await room.updateOne({ 
            $push: { participants: { $each: filteredInviteUsers } } 
        });

        if (result.nModified === 0) {
            res.status(500);
            throw new Error('Не удалось пригласить участников');
        }

        const updatedRoom = await Room.findById(roomId);

        await updatedRoom?.populate({ path: 'participants', select: '_id name surname avatar status last_seen' });

        io.emit('update-room', updatedRoom);

        return res.status(201).json({ participants: filteredInviteUsers });

    } catch (error) {
        next(error);
    }
};

export const kickOutOfGroup = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, roomId } = req.body;

    try {
        const recipientUser = await User.findById(userId);
        const room = await Room.findById(roomId);

        if (!room) {
            res.status(404);
            throw new Error('Чат не найден');
        }

        if (room.type === "private") {
            res.status(400);
            throw new Error("Нельзя удалить из приватного чата");
        }
       
        if (!recipientUser) {
            res.status(404);
            throw new Error('Пользователь не найден');
        }

        if (String(room.creator) !== String(req.user?._id)) {
            res.status(400);
            throw new Error('Право на удаление есть только у создателя чата');
        }

        if (room.participants.length === 1) {
            await room.deleteOne();
            return res.status(204).json({ message: "Чат удален" });
        }

        await room.updateOne({
            $pull: { participants: userId }
        })

        const updatedRoom = await Room.findById(roomId);
        await updatedRoom?.populate({ path: 'participants', select: '_id name surname avatar status last_seen' });

        io.emit('update-room', updatedRoom);

        res.status(201).json({ participants: updatedRoom?.participants });

    } catch (error) {
        next(error);
    }
};


export const archive = async (req: Request, res: Response, next: NextFunction) => {
    const { roomId } = req.params;
    console.log(roomId)

    try {
        const room = await Room.findById(roomId);

    if (!room) {
        res.status(404);
        throw new Error('Чат не найден');
    }

    await room.archive();
    return res.status(201).json(room);

    } catch (error) {
        next(error);
    }
}

export const unarchive = async (req: Request, res: Response, next: NextFunction) => {
    const { roomId } = req.params;

    try {
        const room = await Room.findOne({ _id: roomId });

    if (!room) {
        res.status(404);
        throw new Error('Чат не найден');
    }

    await room.unarchive();
    return res.status(201).json(room);

    } catch (error) {
        next(error);
    }
}
