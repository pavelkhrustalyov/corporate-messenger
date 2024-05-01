import { useState } from 'react';
import UserList from '../UserList/UserList';
import styles from './InviteToGroup.module.css';
import Button from '../UI/Button/Button';
import { IUser } from '../../interfaces/IUser';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { inviteToGroupRoom } from '../../store/roomSlice/roomSlice';

const InviteToGroup = ({ roomId, users }: { roomId: string, users: IUser[] }) => {
    const [userIds, setUserIds] = useState<string[]>(users.map(user => user._id));
    const { isLoading } = useSelector((state: RootState) => state.rooms)
    const participants = users.map(user => user._id);
    const dispatch = useDispatch<AppDispatch>();

    const addId = (userId: string) => {
        const existId = userIds.find(id => id === userId);
        if (participants.includes(userId)) {
            toast.error('Пользователь уже в чате');
            return;
        }
        if (existId) {
            setUserIds((userIds) => userIds.filter(id => id !== existId));
        } else {
            setUserIds((userIds) => [ ...userIds, userId ]);
        }
    };

    const addUserToRoom = () => {
        if (!userIds.length) return;
        dispatch(inviteToGroupRoom({ roomId, participants: userIds }));
    };

    return (
        <div className={styles['invite-to-group']}>
            <UserList userIds={userIds} addUserToRoom={addId}/>
            <Button 
                onClick={() => addUserToRoom()} 
                color="primary">{isLoading ? 'Загрузка...' : 'Добавить в чат'}</Button>
        </div>
    );
};

export default InviteToGroup;