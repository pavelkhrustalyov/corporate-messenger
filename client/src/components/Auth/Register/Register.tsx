import { ChangeEvent, FormEvent, useState } from 'react';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import styles from '../Auth.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../../store/authSlice/authApiSlice';
import { toast, ToastContainer } from 'react-toastify';
import { AxiosError } from 'axios';
import CustomSelect from '../../UI/CustomSelect/CustomSelect';
import { genderType, positionTypes } from '../../../types/types';

export interface RegisterForm {
    name: string,
    surname: string,
    patronymic: string,
    email: string,
    password: string,
    phone: string,
    dateOfBirthday: Date | '',
    confirmPassword: string,
    position: positionTypes;
    gender: genderType;
}

const Register = () => {
    const [ register, { isSuccess, isLoading } ] = useRegisterMutation();

    const [selectPosition, setSelectPosition] = useState<positionTypes>("Frontend Developer");
    const [selectGender, setSelectGender] = useState<genderType>("male"); 

    const [positions] = useState<positionTypes[]>([
        'Security Specialist',
        'Systems Analyst',
        'QA Engineer',
        'Product Manager',
        'DevOps Engineer',
        'Backend Developer',
        'Frontend Developer',
        'UX/UI Designer'
    ]);

    const [genders] = useState<genderType[]>([
        "male",
        "female"
    ]);

    const selectHandlerPosition = (position: positionTypes) => {
        setSelectPosition(position);
    }

    const selectHandlerGender = (gender: genderType) => {
        setSelectGender(gender);
    }

    const navigate = useNavigate();

    const [ form, setForm ] = useState<RegisterForm>({
        name: '',
        surname: '',
        patronymic: '',
        dateOfBirthday: '',
        position: 'Security Specialist',
        phone: '',
        email: '',
        password: '',
        gender: "male",
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
    } = form;

    const registerForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Пароли не совпадают!");
            return;
        }
        setForm((prevForm) => ({ 
            ...prevForm, 
            dateOfBirthday:  dateOfBirthday ? new Date(dateOfBirthday) : '',
            position: selectPosition,
            gender: selectGender,
        }));
        try {
            // await register(form).unwrap();
            // toast.success('Вы успешно зарегистрировались! Дождитесь подтверждения администратора');
            // navigate('/auth/login');
            console.log(form)
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            } else {
                console.log(error.data.message)
                toast.error("Ошибка сервера, попробуйте зайти позднее");
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
                    name="dateOfBirthday"
                    value={dateOfBirthday}
                    onChange={onChangeField}
                    className={styles.field}
                    type="date"
                    placeholder="Дата рождения"
                />

                <CustomSelect defaultValue={selectPosition} selectHandler={selectHandlerPosition} data={positions} />
                <CustomSelect defaultValue={selectGender} selectHandler={selectHandlerGender} data={genders} />

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