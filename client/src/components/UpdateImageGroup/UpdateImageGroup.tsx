import { ChangeEvent, FormEvent, useState } from 'react';
import { IRoom } from '../../interfaces/IRoom';
import Avatar from '../Avatar/Avatar';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import styles from './UpdateImageGroup.module.css';
import Form from '../Form/Form';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { updateRoomImage } from '../../store/roomSlice/roomAsync';

const UpdateImageGroup = ({ room }: { room: IRoom }) => {
    const [ file, setFile ] = useState<File | null>(null);

    const dispatch = useDispatch<AppDispatch>();

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image')) {
                toast.error("Выберите корректный формат изображения!");
                setFile(null);
                return;
            }
            setFile(file);
        }
    };

    const updateGroupImage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            toast.error("Загрузите изображение!");
            return;
        }

        const formData = new FormData();
        formData.append('group-avatar', file);

        dispatch(updateRoomImage({ roomId: room._id, formData }));
        toast.success("Аватар чата успешно обновлен!");
        setFile(null);
    };
    
    return (
        <Form onSubmit={updateGroupImage} className={styles['image-group']}>
            <Input
                id="updateGroupFile"
                name='updateGroupFile'
                onChange={onChangeHandler}
                type="file"
                icon={false}
                label={
                    <div className={styles.label}>
                        { file &&  <Button className={styles.button} color='none'>
                            Обновить фото</Button> 
                        }
                         <Avatar size='large' src={`/group_avatars/${room?.imageGroup}`} />
                    </div>
                }
            />
            { }
        </Form>
    );
};

export default UpdateImageGroup;