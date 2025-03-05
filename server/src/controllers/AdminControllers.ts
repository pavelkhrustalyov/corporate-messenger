import { io } from "..";
import User from "../models/User";
import { Request, Response, NextFunction } from 'express';

export const unverifyUser = async (req: Request, res: Response, next: NextFunction) => {
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

        io.emit("unverify-user", userId);
        
        await User.findByIdAndUpdate({ _id: userId }, { $set: { isVerified: false }});
        res.status(200).json({ message: `Пользователь ${user.name} успешно верифицирован` });

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

export const updatePosition = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { position } = req.body;
    try {
        const user = await User.findById(req.user?._id);

        if (user?.role !== "admin") {
            res.status(400);
            throw new Error("Только администратор может установить должность");
        }

        const currentUser = await User.findById(userId);
        if (!currentUser) {
            res.status(404);
            throw new Error("Пользователь не найден");
        }

        await currentUser.updateOne({ position });

        return res.status(200).json({ message: "Должность успешно установлена" });

    } catch (error) {
        next(error)
    }

}