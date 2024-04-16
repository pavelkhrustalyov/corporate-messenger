import jwt from 'jsonwebtoken';
import { Response } from 'express';

export default (res: Response, userId: string): string => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.EXPIRES_TOKEN
    })

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 21 * 24 * 3600 * 1000
    })

    return token;
}


