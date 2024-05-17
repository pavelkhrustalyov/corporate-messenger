import { NavLink } from 'react-router-dom';
import styles from './RoomItem.module.css';
import cn from 'classnames';
import { IRoom } from '../../interfaces/IRoom';
import Avatar from '../Avatar/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { getFullDate } from '../../utils/convertDate';
import { useEffect, useState } from 'react';
import socket from '../../utils/testSocket';
import { updateStatusInRooms } from '../../store/roomSlice/roomSlice';
import { AiOutlineClose } from "react-icons/ai";
import { archiveRoom, unarchiveRoom } from '../../store/roomSlice/roomSlice';
import Headling from '../Headling/Headling';
import { titleSlice } from '../../utils/textSlice';

interface IRoomItemProps {
    room: IRoom
}

const RoomItem = ({ room }: IRoomItemProps) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [contextMenuActive, setContextMenuActive] = useState<boolean>(false);

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
    }, []);

    const interlocutor = room.participants.find(p => p._id !== user?._id)
    const isArchiveRoom = user && room.archivedUsers.includes(user?._id);

    const unreadMessages = room.messages.filter(({ isRead, senderId }) => {
        return !isRead && senderId === interlocutor?._id
    });
    
    const getFullName = (): string => {
        return `${interlocutor?.name} ${interlocutor?.surname}`;
    };

    const contextMenuHandler = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        setContextMenuActive(prev => !prev);
    }

    const archivedRoom = () => {
        if (room) {
            dispatch(archiveRoom(room._id));
            setContextMenuActive(false);
        }
    };

    const unarchivedRoom = () => {
        if (room) {
            dispatch(unarchiveRoom(room._id));
            setContextMenuActive(false);
        }
    };

    return (
        <NavLink
            to={`${room._id}`}
            onContextMenu={contextMenuHandler}
            className={({ isActive }) => cn(styles['room-item'], { [styles.active]: isActive })}
        >
            { room.type === 'group' ?
                <Avatar src={`/group_avatars/${room.imageGroup}`} size='middle' alt={room.title}/>
                : <Avatar isOnline={interlocutor?.status === "Online"} src={`/avatars/${interlocutor?.avatar}`} size='middle' alt={interlocutor?.name}/>
            }

            {
                contextMenuActive && (
                    <div className={styles["context-menu"]}>
                        { isArchiveRoom ? 
                            <span onClick={unarchivedRoom}>Убрать из архива</span> :
                            <span onClick={archivedRoom}>В архив</span>
                        }
                        <div onClick={() => setContextMenuActive(false)} className={styles.close}><AiOutlineClose/></div>
                    </div>
                )
            }
            
            <div className={styles['room-item__data']}>
                <div className={styles['room-item__title']}>
                    <> {room.type === 'group'
                        ? <Headling element='h4'>{titleSlice(room.title || '', 18)}</Headling>
                        : <Headling element='h4'>{titleSlice(getFullName(), 25)}</Headling> }
                        { unreadMessages.length !== 0 && <span className={styles.unread}>{unreadMessages.length}</span>}
                    </>
                </div>
                <div className={styles['room-item__message']}>{ titleSlice(room.lastMessage, 25)}</div>
                <div className={styles['room-item__date']}>
                    { room.updatedAt ?
                    getFullDate(room.updatedAt) : 
                    getFullDate(room.createdAt) }
                </div>
            </div>

        </NavLink>
    )
};

export default RoomItem;

