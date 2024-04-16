import { Router } from 'express';
import { getRooms, createPrivateRoom, createGroupRoom, deleteRoom } from '../controllers/RoomControllers';
import authMiddleware from '../middlewares/auth';
// import { check } from 'express-validator';

const router: Router = Router();

router.get('/rooms', authMiddleware, getRooms);
router.post('/create/group', authMiddleware, createGroupRoom);
router.post('/create/:recipientId', authMiddleware, createPrivateRoom);
router.delete('/delete/:roomId', authMiddleware, deleteRoom);

export default router;