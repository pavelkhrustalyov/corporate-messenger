import { Router } from 'express';
import { getMessages, createMessage, readMessages, deleteMessage, searchMessages } from '../controllers/MessageControllers';
import authMiddleware from '../middlewares/auth';
import { uploadMessageImage } from '../utils/multer';
import { resizeImageForMessage } from '../utils/sharp';
// import { check } from 'express-validator';

const router = Router();

router.get('/:roomId/search', searchMessages);
router.get('/:roomId', authMiddleware, getMessages);

router.post('/create',
    authMiddleware,
    uploadMessageImage.single('content'),
    resizeImageForMessage,
    createMessage
);
router.delete('/delete/:messageId/:senderId', deleteMessage);

router.patch('/read-messages/:roomId', authMiddleware, readMessages);

export default router;
