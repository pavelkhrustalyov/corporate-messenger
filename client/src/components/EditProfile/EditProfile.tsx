import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import styles from './EditProfile.module.css';
import Button from '../UI/Button/Button';
import { closeEditProfile, closeProfileModal } from '../../store/modalSlice/modalSlice';
import Form from '../Form/Form';
import Input from '../UI/Input/Input';
import Headling from '../Headling/Headling';
import { FaArrowLeft } from "react-icons/fa6";
import { useEffect, useState } from 'react';
import { IEditProfile } from '../../interfaces/IEditProfile';
import { updateUser } from '../../store/authSlice/authSlice';
import { toast } from 'react-toastify';

const EditProfile = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { user } = useSelector((state: RootState) => state.auth);

    const [form, setForm] = useState<IEditProfile>({
        name: '',
        surname: '',
        patronymic: '',
        email: '',
        phone: '',
        dateOfBirthday: '',
    });

    useEffect(() => {
        setForm((prevForm) => ({
            ...prevForm,
            name: user?.name || "",
            surname: user?.surname || "",
            patronymic: user?.patronymic || "",
            email: user?.email || "",
            phone: user?.phone || "",
            dateOfBirthday: user?.dateOfBirthday ? new Date(user.dateOfBirthday).toISOString().slice(0, 10) : "",
        }));
    }, [user]);


    const { name, surname, patronymic, email, phone, dateOfBirthday } = form;

    const editProfileHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(updateUser(form));
        toast.success("Профиль успешно обновлен");
        dispatch(closeProfileModal());
    };

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prevForm) => ({ ...prevForm, [e.target.name]: e.target.value }));
    };

    return <div className={styles['edit-profile']}>
        <Button
            className={styles.back}
            onClick={() => dispatch(closeEditProfile())} 
            color='transparent'>
                <FaArrowLeft/>
        </Button>
        <Headling className={styles.heading} element='h3'>Обновить профиль</Headling>

        <Form onSubmit={editProfileHandler} className={styles.form}>
            <>
                <Input onChange={onChangeHandler} className={styles.input} name="name" placeholder='Ваше имя' type='text' value={name} />
                <Input onChange={onChangeHandler} className={styles.input} name="surname" placeholder='Ваша фамилия' type='text' value={surname}  />
                <Input onChange={onChangeHandler} className={styles.input} name="patronymic" placeholder='Ваше отчество' type='text' value={patronymic}  />
            </>

            <>
                <Input onChange={onChangeHandler} className={styles.input} name="email" placeholder='Ваш email' type='email' value={email}  />
                <Input onChange={onChangeHandler} className={styles.input} name="phone" placeholder='Ваш телефон' type='number' value={phone}  />
                <Input onChange={onChangeHandler} className={styles.input} name="dateOfBirthday" type='date' value={dateOfBirthday}  />
            </>

            <Button color='primary'>Обновить</Button>
        </Form>
    </div>
};

export default EditProfile;