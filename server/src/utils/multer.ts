import multer, { FileFilterCallback, MulterError } from 'multer';
import { Request } from 'express';

interface CustomError extends Error {
    kind?: string;
}

const storageAvatar = multer.memoryStorage();
const storageMessage = multer.memoryStorage();

const isLegalFormatImages = (file: Express.Multer.File): boolean => {
    return file.mimetype === 'image/jpeg' || 
    file.mimetype === 'image/png' || 
    file.mimetype === 'image/jpg'
};

const isLegalFormatFiles = (file: Express.Multer.File): boolean => {
    return file.mimetype === 'text/plain' ||
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
    file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || 
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.mimetype === 'application/zip' ||
    file.mimetype === 'application/rar'
};

const isLegalFormatsMessage = (file: Express.Multer.File): boolean => {
    return isLegalFormatImages(file) || isLegalFormatFiles(file);
}

const fileFilterForAvatar = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (isLegalFormatImages(file)) {
        cb(null, true);
    } else {
        const error = new Error('Неверный формат файла. Только JPEG, PNG, and JPG доступны');
        cb(error);
    }
};

const fileFilterForMessage = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (isLegalFormatsMessage(file)) {
        cb(null, true);
    } else {
        const error = new Error('Неверный формат файла. Доступные форматы: JPEG, PNG, JPG, PPTX, DOCX, PDF, TXT');
        cb(error);
    }
};

export const uploadAvatar = multer({
    storage: storageAvatar,
    fileFilter: fileFilterForAvatar
});

export const uploadMessageImage = multer({
    storage: storageMessage,
    fileFilter: fileFilterForMessage
});
