import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import styles from '../Auth.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../../../store/authSlice/authApiSlice';
// import { setCredentials } from '../../../store/authSlice/authSlice';
// import { RootState } from '../../../store/store';

import 'react-toastify/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { setCredentials } from '../../../store/authSlice/authSlice';
import { RootState } from '../../../store/store';

interface LoginForm {
    email: string;
    password: string;
}

const Login = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const [ login, { isLoading } ] = useLoginMutation();

    useEffect(() => {
        if (user) {
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
        } catch (error) {
            toast.error('Error! is Error');
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