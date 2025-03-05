import { Router } from 'express';
// import { check } from 'express-validator';
import { unverifyUser, verifyUser, updatePosition } from '../controllers/AdminControllers';
import authMiddleware from '../middlewares/auth';

const router = Router();

router.patch('/verify/:userId', authMiddleware, verifyUser);
router.delete('/unverify/:userId', authMiddleware, unverifyUser);
router.patch('/update-position/:userId', authMiddleware, updatePosition);

export default router;