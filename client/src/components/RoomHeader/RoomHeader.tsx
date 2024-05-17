import Modal from '../Modal/Modal';
import styles from './RoomHeader.module.css';
import Button from '../UI/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import Avatar from '../Avatar/Avatar';
import { FaCirclePlus } from "react-icons/fa6";
import { IMessage } from '../../interfaces/IMessage';
import { getFullDate } from '../../utils/convertDate';
import { 
        closeRoomDataModal,
        openProfileModal,
        openRoomDataModal,
        openSideInfo, 
 } from '../../store/modalSlice/modalSlice';

import { IRoom } from '../../interfaces/IRoom';
import Headling from '../Headling/Headling';
import InviteToGroup from '../InviteToGroup/InviteToGroup';
import { useEffect } from 'react';
import socket from '../../utils/testSocket';
import { deleteRoom, leaveRoom, setRoom } from '../../store/roomSlice/roomSlice';
import { MdLogout } from "react-icons/md";

interface IPropsRoomHeader {
    messages: IMessage[]; 
    room: IRoom | null;
}

const RoomHeader = ({ room }: IPropsRoomHeader) => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { isOpenRoomData } = useSelector((state: RootState) => state.modal);
    const interlocutor = room?.participants.find(p => p._id !== user?._id);
    const currentUser = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        socket.on("leave-group-room", ({ room, userId }: { room: IRoom, userId: string }) => {
            if (room) {
                if (currentUser && currentUser._id === userId) {
                    dispatch(deleteRoom(room._id));
                }
                dispatch(setRoom(room));
            }
        });

        return () => {
            socket.off('leave-group-room');
        }
    }, []);

    const leaveRoomHandler = (roomId: string) => {
        const confirm = window.confirm('Вы хотите покинуть чат?');
        if (confirm)
            dispatch(leaveRoom(roomId));
    };

    return (
        <div className={styles['room-header']}>
            <div className={styles.data}>
                {
                    room?.type === 'group' 
                    ? <Avatar src={`/group_avatars/${room.imageGroup}`} size='middle' />
                    : <Avatar isOnline={interlocutor?.status === "Online"} src={`/avatars/${interlocutor?.avatar}`} size='middle' />
                }

                <div className={styles["user-data"]}>
                    {
                        room?.type === 'group' 
                        ? <div 
                            onClick={() => dispatch(openSideInfo())} 
                            className={styles.title}>{room.title}
                            </div>
                        : (
                            <>
                                <div onClick={() => dispatch(openProfileModal(interlocutor?._id || ''))} className={styles.title}>{interlocutor?.name} {interlocutor?.surname}</div>
                                { interlocutor?.status === "Offline" ?
                                  <div className={styles.status}>
                                    Был(а)&nbsp;в&nbsp;сети:&nbsp;{getFullDate(new Date(interlocutor.last_seen).toString())}
                                  </div>
                                : <div className={styles.status}>{interlocutor?.status}</div> 
                                }
                            </>
                        )
                    }
                    
                </div>
            </div>

            <div className={styles.utils}>
                {
                    room?.type === "private" ? (
                        <>
                            <Button color="transparent">
                                <img className={styles.icon} src="phone.svg" alt="Позвонить" />
                            </Button>
                            <Button color="transparent">
                                <img className={styles.icon} src="video.svg" alt="начать видеочат" />
                            </Button>
                            <Button color="transparent" onClick={() => dispatch(openSideInfo())}>
                                <img className={styles.icon} src="more.svg" alt="Подробнее" />
                            </Button>
                        </>
                    ) : (
                        <>
                        {
                            room?.creator?._id === user?._id &&  
                            <Button color="transparent" onClick={() => dispatch(openRoomDataModal())} >
                                <FaCirclePlus className={styles.icon}/>
                            </Button>
                        }
                        {
                            room && <Button
                                color="transparent" 
                                onClick={() => leaveRoomHandler(room._id)} >
                                <MdLogout className={styles.icon}/>
                            </Button>
                        }
                        </>
                    )
                }
            </div>

            {
                room?.type !== "private" && (
                    <>
                        <Modal isOpen={isOpenRoomData} onClose={() => dispatch(closeRoomDataModal())}>
                            <Headling element="h3">Добавить пользователя в чат</Headling>
                            { room && <InviteToGroup roomId={room._id} users={room?.participants} />}
                        </Modal>
                    </>
                )
            }
        </div>
    )
}

export default RoomHeader;
