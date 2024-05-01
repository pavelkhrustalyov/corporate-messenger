import { NavLink } from 'react-router-dom';
import styles from './RoomItem.module.css';
import cn from 'classnames';
import { IRoom } from '../../interfaces/IRoom';
import Avatar from '../Avatar/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { getFullDate } from '../../utils/convertDate';
import { useEffect } from 'react';
import socket from '../../utils/testSocket';
import { updateStatusInRooms } from '../../store/roomSlice/roomSlice';

interface IRoomItemProps {
    room: IRoom
}

const RoomItem = ({ room }: IRoomItemProps) => {
    const { user } = useSelector((state: RootState) => state.auth);

    const messageSlice = (msg: string, cupChars: number): string => {
        return msg.length > cupChars ? `${msg.slice(0, cupChars)}...` : msg;
    };

    const dispatch = useDispatch<AppDispatch>();
    
    useEffect(() => {
        const handleOnline = (userId: string) => {
            dispatch(updateStatusInRooms({ userId, status: "Online" }));
        };
    
        const handleOffline = (userId: string) => {
            dispatch(updateStatusInRooms({ userId, status: "Offline" }));
        };
    
        socket.on("online", handleOnline);
        socket.on("offline", handleOffline);
    
        return () => {
            socket.off("online", handleOnline);
            socket.off("offline", handleOffline);
        };
    }, [room]);

    const interlocutor = room.participants.find(p => p._id !== user?._id)

    const getFullName = (): string => {
        return `${interlocutor?.name} ${interlocutor?.surname}`;
    };

    return (
        <NavLink
            to={`${room._id}`}
            className={({ isActive }) => cn(styles['room-item'], { [styles.active]: isActive })}
        >   
            { room.type === 'group' ?  
                <Avatar src={`/group_avatars/${room.imageGroup}`} size='middle' alt={room.title}/>
                : <Avatar isOnline={interlocutor?.status === "Online"} src={`/avatars/${interlocutor?.avatar}`} size='middle' alt={interlocutor?.name}/>
            }
            
            <div className={styles['room-item__data']}>
                <div className={styles['room-item__title']}>
                    <div> {room.type === 'group'
                        ? messageSlice(room.title || '', 20)
                        : messageSlice(getFullName(), 25)}
                    </div>
                </div>
                <div className={styles['room-item__message']}>{ messageSlice(room.lastMessage, 25)}</div>
                <div className={styles['room-item__date']}>
                    { room.updatedAt ?
                    getFullDate(room.updatedAt) : 
                    (room.createdAt) }
                </div>
            </div>

        </NavLink>
    )
};

export default RoomItem;

