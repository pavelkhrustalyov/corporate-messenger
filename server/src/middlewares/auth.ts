import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUserSchema } from '../models/User';
// import asyncHandler from 'express-async-handler'
// import User, { IUserSchema } from '../models/User';

interface DecodedToken extends JwtPayload {
    id: string;
}

declare global {
    namespace Express {
      interface Request {
        user?: IUserSchema | null;
      }
    }
  }

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: 'Вы не авторизованы' })

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET as Secret) as DecodedToken;
        req.user = await User.findById(decoded.userId)
          .select('-password') as IUserSchema;
        next();
    } catch(e) {
        res.status(401).json({ message: "Неудачная аутентификация" });
    }
}

export default authenticateToken;