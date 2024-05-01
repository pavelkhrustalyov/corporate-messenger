import { Router } from 'express';

import { getRooms, 
    leaveRoom, 
    inviteToGroupRoom,
    kickOutOfGroup,
    getRoomById,
    createRoom,
    archive,
    unarchive } from '../controllers/RoomControllers';

import authMiddleware from '../middlewares/auth';

const router: Router = Router();

router.patch('/kickOut', authMiddleware, kickOutOfGroup);

router.patch('/invite', authMiddleware, inviteToGroupRoom);
router.get('/rooms', authMiddleware, getRooms);
router.post('/archive/:roomId', authMiddleware, archive);
router.post('/unarchive/:roomId', authMiddleware, unarchive);

router.get('/:roomId', authMiddleware, getRoomById);
router.post('/create-room', authMiddleware, createRoom);
router.delete('/delete/:roomId', authMiddleware, leaveRoom);

export default router;