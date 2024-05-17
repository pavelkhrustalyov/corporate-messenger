import { Router } from 'express';
import { getMessages, createMessage, readMessages } from '../controllers/MessageControllers';
import authMiddleware from '../middlewares/auth';
import { uploadMessageImage } from '../utils/multer';
import { resizeImageForMessage } from '../utils/sharp';
// import { check } from 'express-validator';

const router = Router();

router.get('/:roomId', authMiddleware, getMessages);
router.post('/create',
    authMiddleware,
    uploadMessageImage.single('content'),
    resizeImageForMessage,
    createMessage
);
router.patch('/read-messages/:roomId', authMiddleware, readMessages);

export default router;
