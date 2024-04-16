import { Router } from 'express';
import { check } from 'express-validator';
import { getMe, logOut, login, register } from '../controllers/AuthControllers';
import authMiddleware from '../middlewares/auth';

const router = Router();

router.get('/me', authMiddleware, getMe);

router.post('/login', [
    check('email', 'Пожалуйста, введите корректный Email').isEmail().normalizeEmail(),
    check('password', 'Пароль обязателен. Минимум 6 символов').isLength({ min: 6 }).trim(),
], login);

router.post('/register', [
    check('email', 'Пожалуйста, введите корректный Email').isEmail().normalizeEmail(),
    check('password', 'Пароль обязателен. Минимум 6 символов').isLength({ min: 6 }).trim(),
    check('name', 'Имя обязательно').not().isEmpty().trim(),
    check('surname', 'Фамилия обязательна').not().isEmpty().trim(),
    check('patronymic', 'Отчество обязателно').not().isEmpty().trim(),
], register);

router.post('/logout', logOut);


export default router;
