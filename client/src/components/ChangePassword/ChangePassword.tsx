import { ChangeEvent, useState } from 'react';
import Form from '../Form/Form';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import styles from './ChangePassword.module.css';
import { IChangePassword } from '../../interfaces/IChangePassword';
import { toast } from 'react-toastify';

const ChangePassword = () => {

    const [ form, setForm ] = useState<IChangePassword>({
        oldPassword: "",
        newPassword: ""
    });

    const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(form);

        toast.success("Пароль успешно обновлен!");
    };

    const onChangeForm = (e: ChangeEvent<HTMLInputElement>) => {
        setForm(prevForm => ({ ...prevForm, [e.target.name]: e.target.value }));
    }

    return (
        <Form className={styles.form} onSubmit={onSubmitForm}>
            <Input
                name="oldPassword"
                onChange={onChangeForm}
                value={form.oldPassword}
                className={styles.input} 
                type='password' 
                placeholder='Введите старый пароль' 
                required
            />
            <Input 
                name="newPassword"
                onChange={onChangeForm} 
                value={form.newPassword}
                className={styles.input} 
                type='password' 
                placeholder='Введите новый пароль' 
                required
            />
            <Button color='primary'>Обновить пароль</Button>
        </Form>
    )
};

export default ChangePassword;