import { Router } from 'express';

import { getRooms, 
    leaveRoom, 
    inviteToGroupRoom,
    kickOutOfGroup,
    getRoomById,
    createRoom,
    archive,
    unarchive, 
    updateGroupRoomImage} from '../controllers/RoomControllers';

import authMiddleware from '../middlewares/auth';
import { uploadGroupImage } from '../utils/multer';
import { resizeImageGroup } from '../utils/sharp';

const router: Router = Router();

router.patch('/kickOut', authMiddleware, kickOutOfGroup);

router.patch('/invite', authMiddleware, inviteToGroupRoom);
router.get('/rooms', authMiddleware, getRooms);
router.post('/archive/:roomId', authMiddleware, archive);
router.post('/unarchive/:roomId', authMiddleware, unarchive);

router.get('/:roomId', authMiddleware, getRoomById);
router.post('/create-room', authMiddleware, createRoom);
router.patch('/:roomId/upload', 
    uploadGroupImage.single('group-avatar'), 
    resizeImageGroup, 
    authMiddleware, 
    updateGroupRoomImage);

router.delete('/leave/:roomId', authMiddleware, leaveRoom);

export default router;