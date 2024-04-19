import { NavLink } from 'react-router-dom';
import styles from './RoomItem.module.css';
import cn from 'classnames';
import { IRoom } from '../../interfaces/IRoom';
import Avatar from '../Avatar/Avatar';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface IRoomItemProps {
    room: IRoom
}

const RoomItem = ({ room }: IRoomItemProps) => {
    const { user } = useSelector((state: RootState) => state.auth);

    const transformDate = new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(room.createdAt));

    const messageSlice = (msg: string, cupChars: number): string => {
        return msg.length > cupChars ? `${msg.slice(0, cupChars)}...` : msg;
    };

    const [ interlocutor ] = room.type === 'private' ? 
        room.participants.filter(p => p._id !== user?._id)
        : room.participants;

    const getFullName = (): string => {
        return `${interlocutor.name} ${interlocutor.surname}`;
    };

    return (
        <NavLink
            to={`${room._id}`}
            className={({ isActive }) => cn(styles['room-item'], { [styles.active]: isActive })}
        >   
            { room.type === 'group' ?  
                <Avatar src={`/group_avatars/${room.imageGroup}`} size='middle' alt={room.title}/>
                : <Avatar src={`/avatars/${interlocutor.avatar}`} size='middle' alt={interlocutor.name}/>
            }
            
            <div className={styles['room-item__data']}>
                <div className={styles['room-item__title']}>
                    <div> {room.type === 'group'
                        ? messageSlice(room.title || '', 20)
                        : messageSlice(getFullName(), 25)}
                    </div>
                    { room.type !== 'group' && (
                        <div className={cn(styles['status'], {
                            [styles['status-online']]: interlocutor.status === 'Online'
                        })}></div>
                    )}
                </div>
                <div className={styles['room-item__message']}>{messageSlice(room.lastMessage, 25)}</div>
                <div className={styles['room-item__date']}>{transformDate}</div>
            </div>

        </NavLink>
    )
};

export default RoomItem;

