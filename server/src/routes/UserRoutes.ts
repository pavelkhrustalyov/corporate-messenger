import { Router } from 'express';
import { getUserbyId, getUsers, updateAvatar, updateUser, searchUsers } from '../controllers/UserController';
import authMiddleware from '../middlewares/auth';
import { check } from 'express-validator';
import { uploadAvatar } from '../utils/multer';
import { resizeAvatar } from '../utils/sharp';

const router: Router = Router();

router.patch('/update', [
    check('name', 'Имя обязательно для заполнения').not().isEmpty(),
    check('surname', 'Фамилия обязательна для заполнения').not().isEmpty(),
    check('patronymic', 'Отчество обязательно для заполнения').not().isEmpty(),
    check('email', 'Email обязателен для заполнения').isEmail(),
], authMiddleware, updateUser);

router.patch('/upload', 
    authMiddleware,
    uploadAvatar.single('avatar'), 
    resizeAvatar, 
    updateAvatar
);
router.get('/search', authMiddleware, searchUsers);
router.get('/users', authMiddleware, getUsers);
router.get('/:userId', authMiddleware, getUserbyId);


export default router;