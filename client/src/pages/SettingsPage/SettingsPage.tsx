import { useDispatch, useSelector } from 'react-redux';
import styles from './SettingsPage.module.css';
import { AppDispatch, RootState } from '../../store/store';
import Avatar from '../../components/Avatar/Avatar';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import { ChangeEvent, FormEvent, useState } from 'react';
import ChangePassword from '../../components/ChangePassword/ChangePassword';
import Form from '../../components/Form/Form';
import { toast } from 'react-toastify';
import { updateAvatar } from '../../store/authSlice/authSlice';
import { closeSettingsModal } from '../../store/modalSlice/modalSlice';

const SettingsPage = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [ formVisible, setFormVisible ] = useState(false);
    const [ file, setFile ] = useState<File | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    const onChangeFileHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image')) {
                toast.error("Выберите корректный формат изображения!");
                setFile(null);
                return;
            }
            setFile(e.target.files[0]);
        }
    };

    const updateForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        if (file) {
            formData.append('avatar', file);
            dispatch(updateAvatar(formData));
            toast.success("Фото успешно обновлено!");
            dispatch(closeSettingsModal())
        }
    };

    return (
        <div className={styles['settings-page']}>

            <Avatar src={`/avatars/${user?.avatar}`} size="large" />
            <Form className={styles.form} onSubmit={updateForm}>
                <Input id="avatarUpload" onChange={onChangeFileHandler} type="file" label="Загрузить фото" />
                { file && <Button color='primary'>Обновить аватар</Button> } 
            </Form>

            <Button onClick={() => setFormVisible(prev => !prev)} color="primary">
                { !formVisible ? "Смена пароля" : "Отмена"}
            </Button>

            { formVisible && <ChangePassword /> }
        </div>
    );
};

export default SettingsPage;