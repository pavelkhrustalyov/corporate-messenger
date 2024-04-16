import User, { IUserSchema } from "../models/User";
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

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
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users: IUserSchema[]  = await User.find().populate('name surname avatar');
        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, surname, patronymic, email }: IUserSchema = req.body;

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
            email
        })

        const updatedUser = await User.findById(req.user?._id);

        return res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
}