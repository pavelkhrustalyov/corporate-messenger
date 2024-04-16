import { NavLink } from 'react-router-dom';
import styles from './RoomItem.module.css';
import cn from 'classnames';
import { IRoom } from '../../interfaces/IRoom';
import Avatar from '../Avatar/Avatar';

interface IRoomItemProps {
    room: IRoom
}

const RoomItem = ({ room }: IRoomItemProps) => {
    
    const transformDate = new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(room.createdAt);

    const messageSlice = (msg: string, cupChars: number): string => {
        return msg.length > cupChars ? `${msg.slice(0, cupChars)}...` : msg;
    };

    const getFullName = (room: IRoom): string => {
        return `${room.participants[0].name} ${room.participants[0].surname}`;
    };
    
    return (
        <NavLink
            to={`${room._id}`}
            className={({ isActive }) => cn(styles['room-item'], { [styles.active]: isActive })}
        >   
            { room.type === 'group' ?  
                <Avatar src={room.imageGroup} size='middle' alt={room.title}/>
                : <Avatar src={room.participants[1].avatar} size='middle' alt={room.participants[0].name}/>
            }
            
            <div className={styles['room-item__data']}>
                <div className={styles['room-item__title']}>
                    <div> {room.type === 'group'
                        ? messageSlice(room.title, 20)
                        : messageSlice(getFullName(room), 25)}
                    </div>
                    { room.type !== 'group' && (
                        <div className={cn(styles['status'], {
                            [styles['status-online']]: room.participants[0].status === 'Online'
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

