import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export const resizeAvatar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) return next();
        req.file.filename = `avatar-${req.user?._id}-${Date.now()}.jpeg`;

        const avatarsFolderPath = path.join(__dirname, '../public/avatars');

        await sharp(req.file.buffer)
            .resize(150, 150, { fit: 'cover', withoutEnlargement: true })
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`${avatarsFolderPath}/${req.file.filename}`);

        next();
    } catch (error) {
        next(error);
    }
};

export const resizeImageForMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) return next();
        if (req.file?.mimetype.startsWith('image')) {
            req.file.filename = `message-image-${req.user?._id}-${Date.now()}.jpeg`;
            const avatarsFolderPath = path.join(__dirname, '../public/message_images');

            await sharp(req.file.buffer)
                .resize(400, 400, { fit: "inside", withoutEnlargement: true })
                .toFormat('jpeg')
                .jpeg({ quality: 100 })
                .toFile(`${avatarsFolderPath}/${req.file.filename}`);
        } else {
            req.file.filename = `message-file-${req.user?._id}-${Date.now()}${path.extname(req.file.originalname)}`;
            const messageFilesFolderPath = path.join(__dirname, '../public/files');
            await fs.writeFile(`${messageFilesFolderPath}/${req.file.filename}`, req.file.buffer);
        }

        next();
    } catch (error) {
        next(error);
    }
};