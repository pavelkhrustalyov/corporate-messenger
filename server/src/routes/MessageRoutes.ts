import { Router } from 'express';
import { getMessages, createMessage } from '../controllers/MessageControllers';
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

export default router;
