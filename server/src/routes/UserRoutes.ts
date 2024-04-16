import { Router } from 'express';
import { getUserbyId, getUsers, updateUser } from '../controllers/UserController';
import authMiddleware from '../middlewares/auth';
import { check } from 'express-validator';

const router: Router = Router();

router.patch('/update', [
    check('name', 'Имя обязательно для заполнения').not().isEmpty(),
    check('surname', 'Фамилия обязательна для заполнения').not().isEmpty(),
    check('patronymic', 'Отчество обязательно для заполнения').not().isEmpty(),
    check('email', 'Email обязателен для заполнения').isEmail(),
], authMiddleware, updateUser);

router.get('/users', authMiddleware, getUsers);
router.get('/:userId', authMiddleware, getUserbyId);

export default router;