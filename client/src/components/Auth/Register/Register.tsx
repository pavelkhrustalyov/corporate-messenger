import { ChangeEvent, FormEvent, useState } from 'react';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import styles from '../Auth.module.css';
import { Link } from 'react-router-dom';

interface RegisterForm {
    name: string,
    surname: string,
    patronymic: string,
    email: string,
    login: string,
    password: string,
    confirmPassword: string,
    date: string;
}

const Register = () => {

    const [ form, setForm ] = useState<RegisterForm>({
        name: '',
        surname: '',
        patronymic: '',
        email: '',
        login: '',
        password: '',
        confirmPassword: '',
        date: ''
    });

    const {
        name, 
        surname, 
        patronymic, 
        email, 
        login, 
        password, 
        confirmPassword,
        date
    } = form;

    const registerForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(form);
    };

    const onChangeField = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        setForm((prev) => ({ ...prev, [target.name]: target.value }));
    };

    return (
        <>
            <h1 className={styles.heading}>Регистрация</h1>
            <form onSubmit={registerForm} className={styles.auth}>
                <Input
                    required
                    name="name"
                    value={name}
                    onChange={onChangeField}
                    className={styles.field}
                    type="text"
                    placeholder="Введите имя"
                />
                <Input
                    required
                    name="surname"
                    value={surname}
                    onChange={onChangeField}
                    className={styles.field}
                    type="text"
                    placeholder="Введите фамилию"
                />

                <Input
                    required
                    name="date"
                    value={date}
                    onChange={onChangeField}
                    className={styles.field}
                    type="date"
                    placeholder="Дата рождения"
                />

                <Input
                    required
                    name="patronymic"
                    value={patronymic}
                    onChange={onChangeField}
                    className={styles.field}
                    type="text"
                    placeholder="Введите отчество"
                />
                <Input
                    required
                    name="login"
                    value={login}
                    onChange={onChangeField}
                    className={styles.field}
                    type="text"
                    placeholder="Введите логин"
                />

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

                <Input
                    required
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={onChangeField}
                    className={styles.field}
                    type="password"
                    placeholder="Повторите пароль"
                />

                <Button color="primary">Регистрация</Button>

                <div className={styles.question}>
                <span>Есть аккаунт? </span> 
                <Link to="/auth/login">Вход</Link>
                </div>
            </form>
        </>
        
    );
}

export default Register;