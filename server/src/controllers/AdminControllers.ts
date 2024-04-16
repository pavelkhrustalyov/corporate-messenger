import User from "../models/User";
import { Request, Response, NextFunction } from 'express';

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404);
            throw new Error('Пользователь не найден');
        }

        if (req.user?.role !== 'admin') {
            res.status(403);
            throw new Error('У вас нет прав на удаление этого пользователя');
        }

        await user.deleteOne();

        return res.status(204).json({ message: `Пользователь ${userId} успешно удален` });
    } catch (error) {
        next(error);
    }
}

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user) {
            res.status(404);
            throw new Error('Пользователь не найден');
        }

        if (req.user?.role !== 'admin') {
            res.status(403);
            throw new Error('У вас нет прав на верификацию этого пользователя');
        }

        await User.findByIdAndUpdate({ _id: userId }, { $set: { isVerified: true }});
        res.status(200).json({ message: `Пользователь ${user.name} успешно верифицирован` });
        
    } catch (error) {
        next(error);
    }
}