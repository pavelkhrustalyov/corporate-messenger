import User, { IUserSchema } from "../models/User";
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { unlink } from 'fs/promises';
import { join } from 'node:path';

export const getUserbyId = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
        const user: IUserSchema = await User.findById(userId)
            .select('-password -notifications -role -isVerified')
        if (!user) {
            res.status(404);
            throw new Error(`Пользователь ${userId} не найден`);
        }
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users: IUserSchema[]  = await User.find().populate('name surname avatar status last_seen');
        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.query as { query: string };
    try {
        const users: IUserSchema[]  = await User.find({
            $or: [
                { name: new RegExp(query, 'i') },
                { surname: new RegExp(query, 'i') }
            ]
        }).select('name surname status avatar last_seen');
        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, surname, patronymic, email, phone, dateOfBirthday }: IUserSchema = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() });
    }

    try {
        const user: IUserSchema | null = await User.findById(req.user?._id);

        if (!user) {
            res.status(404);
            throw new Error(`Пользователь ${req.user?._id} не найден`);
        }

        await user.updateOne({
            name,
            surname,
            patronymic,
            email,
            phone,
            dateOfBirthday
        })
        const updatedUser = await User.findById(req.user?._id)
            .select('-password');
        return res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
}

export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
        return res.status(200).json(req.user);
    }

    const filename = req.file.filename;

    const avatarsFolderPath = join(__dirname, '../public/avatars');
    if (req.user?.avatar !== 'default.png') {
        try {
            await unlink(`${avatarsFolderPath}/${req.user?.avatar}`);
        } catch (error) {
            next(error);
        }
    }

    try {
        const user = await User.findById(req.user?._id);
        await user?.updateOne({
            $set: { avatar: filename }
        })
        const userUpdated = await User.findById(req.user?._id)
            .select('-password');

        return res.status(201).json(userUpdated);
    } catch (error) {
        next(error);
    }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {}
