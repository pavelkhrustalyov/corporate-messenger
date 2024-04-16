import { Request, Response, NextFunction } from "express";
import { validationResult } from 'express-validator';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import generateToken from "../utils/generateToken";

export const logOut = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0),
        });
        return res.status(200).json({ message: 'Вы вышли из системы' });
    } catch (error) {
        next(error);
    }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { name, surname, patronymic, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
        return res.status(400)
            .json({ message: 'Пользователь уже зарегистрирован' });
    }

    try {
        const cryptPassword = await bcrypt.hash(password, 10);
        user = await User.create({
            name,
            surname,
            patronymic,
            email,
            avatar: 'avatars/default.jpeg',
            password: cryptPassword
        });
    
        await user.save(); 
        return res.status(200).json({ 
            message: `Пользователь успешно зарегистрирован, 
            дождитесь одобрения администратора` 
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    const { email, password } = req.body;

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id);
            return res.status(200).json({
                id: user._id, 
                name: user.name,
                surname: user.surname,
                status: user.status,
                avatar: user.avatar,
                notifications: user.notifications
            });
        } else {
            res.status(400);
            throw new Error('Неверный email или пароль');
        }
    } catch (error) {
        next(error);
    }
}

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUser = req.user;

        if (!currentUser) {
            res.status(401);
            throw new Error('Вы не авторизованы');
        }

        return res.status(200).json(currentUser);
    } catch (error) {
        next(error);
    }
};