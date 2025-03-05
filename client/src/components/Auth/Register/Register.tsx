import { ChangeEvent, FormEvent, useState } from 'react';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import styles from '../Auth.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../../store/authSlice/authApiSlice';
import { toast, ToastContainer } from 'react-toastify';
import CustomSelect from '../../UI/CustomSelect/CustomSelect';
import { Gender, Position, SelectType } from '../../../types/types';
import { RegisterForm } from '../../../interfaces/RegisterForm';
import { gendersForSelect, positionsForSelect } from './utils';

const Register = () => {
    const [ register, { isLoading } ] = useRegisterMutation();
    const navigate = useNavigate();

    const [selectPosition, setSelectPosition] = useState<Position>("Frontend Developer");
    const [selectGender, setSelectGender] = useState<Gender>("male");

    const [positions] = useState<SelectType[]>(positionsForSelect);
    const [genders] = useState<SelectType[]>(gendersForSelect);

    const selectHandlerPosition = (position: Position) => {
        setSelectPosition(position);
        setForm((prevForm) => ({ ...prevForm, position }));
    }

    const selectHandlerGender = (gender: Gender) => {
        setSelectGender(gender);
        setForm((prevForm) => ({ ...prevForm, gender }));
    }

    const [ form, setForm ] = useState<RegisterForm>({
        name: '',
        surname: '',
        patronymic: '',
        dateOfBirthday: '',
        position: selectPosition,
        phone: '',
        email: '',
        password: '',
        gender: selectGender,
        confirmPassword: '',
    });

    const {
        name, 
        surname,
        patronymic,
        email,
        password,
        confirmPassword,
        dateOfBirthday,
        phone,
        position,
        gender
    } = form;

    const registerForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Пароли не совпадают!");
            return;
        }
      
        try {
            await register(form).unwrap();
            navigate('/auth/login');
            toast.success('Вы успешно зарегистрировались! Дождитесь подтверждения администратора');
        } catch (error: any) {
            if (error && error?.status === 400) {
                toast.error(error.data.message);
                return;
            } else {
                toast.error("Ошибка сервера, попробуйте зайти позднее");
                return;
            }
        }
    };

    const onChangeField = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        setForm((prev) => ({ ...prev, [target.name]: target.value }));
    };

    return (
        <>
            <h1 className={styles.heading}>Регистрация</h1>
            <ToastContainer />
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
                    name="patronymic"
                    value={patronymic}
                    onChange={onChangeField}
                    className={styles.field}
                    type="text"
                    placeholder="Введите отчество"
                />

                <Input
                    required
                    name="dateOfBirthday"
                    value={dateOfBirthday}
                    onChange={onChangeField}
                    className={styles.field}
                    type="date"
                    placeholder="Дата рождения"
                />

                <CustomSelect 
                    className={styles.select} 
                    defaultValue={position} 
                    selectHandler={selectHandlerPosition} 
                    data={positions}
                />
                <CustomSelect 
                    className={styles.select} 
                    defaultValue={gender} 
                    selectHandler={selectHandlerGender} 
                    data={genders}
                />

                <Input
                    required
                    name="phone"
                    value={phone}
                    onChange={onChangeField}
                    className={styles.field}
                    type="number"
                    placeholder="Введите номер телефона"
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

                <Button color="primary">{ isLoading ? 'Загрузка...' : "Регистрация"}</Button>

                <div className={styles.question}>
                <span>Есть аккаунт? </span> 
                <Link to="/auth/login">Вход</Link>
                </div>
            </form>
        </>
    );
}

export default Register;