import { Router } from 'express';
// import { check } from 'express-validator';
import { deleteUser, verifyUser } from '../controllers/AdminControllers';
import authMiddleware from '../middlewares/auth';

const router = Router();

router.delete('/user/:userId', authMiddleware, deleteUser);
router.patch('/user/:userId', authMiddleware, verifyUser);

export default router;