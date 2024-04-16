import { Router } from 'express';

import { getRooms, 
    createPrivateRoom, 
    createGroupRoom, 
    deleteRoom, 
    inviteToGroupRoom,
    kickOutOfGroup } from '../controllers/RoomControllers';

import authMiddleware from '../middlewares/auth';
// import { check } from 'express-validator';

const router: Router = Router();

router.patch('/:roomId/invite', authMiddleware, inviteToGroupRoom);
router.patch('/:roomId/kick/:recipientId', authMiddleware, kickOutOfGroup);

router.get('/rooms', authMiddleware, getRooms);
router.post('/create/group', authMiddleware, createGroupRoom);
router.post('/create/:recipientId', authMiddleware, createPrivateRoom);
router.delete('/delete/:roomId', authMiddleware, deleteRoom);



export default router;