import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import styles from '../Auth.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../../../store/authSlice/authApiSlice';

import 'react-toastify/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { setCredentials } from '../../../store/authSlice/authSlice';
import { RootState } from '../../../store/store';
import socket from '../../../utils/testSocket';
import { LoginForm } from '../../../interfaces/LoginForm';

interface CustomError extends Error {
    data?: { message: string };
}

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const [ login, { isLoading } ] = useLoginMutation();

    useEffect(() => {
        if (user) {
            socket.emit('user-online', { userId: user?._id });
            navigate('/');
        }
    }, [navigate, user])

    const [ form, setForm ] = useState<LoginForm>({
        email: '',
        password: ''
    });

    const { email, password } = form;

    const loginForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const userData = await login({ email, password }).unwrap();
            dispatch(setCredentials(userData));
            toast.success('Вы успешно авторизовались в системе!');
        } catch (error) {
            const customError = error as CustomError;
            if (customError && customError.data) {
                toast.error(customError.data.message)
            } else {
                toast.error('Что-то пошло не так. Пожалуйста, попробуйте снова.');
            }
        }
    };

    const onChangeField = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        setForm((prev) => ({...prev, [target.name]: target.value }));
    };

    return (
        <>
            <h1 className={styles.heading}>Авторизация</h1>
            <ToastContainer />
            <form onSubmit={loginForm} className={styles.auth}>
                <Input
                    required
                    name="email"
                    value={email}
                    onChange={onChangeField}
                    className={styles.field}
                    type="email"
                    placeholder="Введите email"
                />
                <Input
                    required
                    name="password"
                    value={password}
                    onChange={onChangeField}
                    className={styles.field}
                    type="password"
                    placeholder="Введите пароль"
                />
                <Button color="primary">{isLoading ? 'Loading...' :'Вход'}</Button>
                <div className={styles.question}>
                <span>Нет аккаунта? </span> 
                <Link to="/auth/register">Зарегистрироваться</Link>
                </div>
            </form>
        </>
        
    );
}

export default Login;