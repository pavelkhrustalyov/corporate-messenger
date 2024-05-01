import styles from './CreateRoom.module.css';
import UserList from '../UserList/UserList';
import { useState } from 'react';
import Button from '../UI/Button/Button';
import Headling from '../Headling/Headling';
import { ToastContainer, toast } from 'react-toastify';
import Input from '../UI/Input/Input';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { createRoom } from '../../store/roomSlice/roomSlice';

interface IPropsCreateRoom {
    typeRoom: "private" | "group"
}

const CreateRoom = ({ typeRoom }: IPropsCreateRoom) => {
    const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false);
    const [ userIds, setUserIds ] = useState<string[]>([]);
    const [ title, setTitle ] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();
    
    const addUserToRoom = (userId: string) => {
        const existId = userIds.find(id => id === userId);

        if (existId) {
            setUserIds((userIds) => userIds.filter(id => id !== existId));
        } else {
            setUserIds((userIds) => [ ...userIds, userId ]);
        }

    };

    const createChat = () => {
        if (typeRoom === "group") {
            if (!title.trim().length) {
                toast.error("Имя группы не может быть пустым")
                return;
            }

            const data = {
                title: title.trim(),
                type: typeRoom,
                users: userIds
            }
            dispatch(createRoom(data));
        } else {
            if (userIds.length > 1) {
                toast.error("Максимальное кол-во участников приватного чата - 1");
                return;
            }
            const data = {
                type: typeRoom,
                users: userIds
            }

            dispatch(createRoom(data));
        }
    }

    return (
        <div className={styles['create-room']}>
            <ToastContainer />
            <Headling className={styles.title} element='h2'>{typeRoom === 'private' ? "Создать приватный чат" : "Создать групповой чат"}</Headling>
            <Button
                onClick={() => setIsOpenSearch(true)} 
                color='primary'>{typeRoom === 'group' ? "Добавить участников" : "Добавить собеседника"}
            </Button>
          

            { isOpenSearch && (
                <div className={styles.controllers}>
                    <UserList userIds={userIds} addUserToRoom={addUserToRoom} />
                    {
                        typeRoom === "group" && (
                            <Input
                                className={styles['title-field']}
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                placeholder='Введите название группы'
                            />
                        )
                    }
                    <Button
                        disabled={userIds.length === 0}
                        onClick={createChat}
                        color='primary'>{typeRoom === 'group' ? "Cоздать общий чат" : "Создать диалог"}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CreateRoom;