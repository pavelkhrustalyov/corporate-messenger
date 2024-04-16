import { Router } from 'express';

import { getRooms, 
    createPrivateRoom, 
    createGroupRoom, 
    deleteRoom, 
    inviteToGroupRoom,
    kickOutOfGroup,
    getRoomById } from '../controllers/RoomControllers';

import authMiddleware from '../middlewares/auth';

const router: Router = Router();

router.patch('/:roomId/kick/:recipientId', authMiddleware, kickOutOfGroup);

router.get('/rooms', authMiddleware, getRooms);
router.get('/:roomId', authMiddleware, getRoomById);
router.post('/create/group', authMiddleware, createGroupRoom);
router.post('/create/:recipientId', authMiddleware, createPrivateRoom);
router.delete('/delete/:roomId', authMiddleware, deleteRoom);
router.patch('/invite', authMiddleware, inviteToGroupRoom);

export default router;