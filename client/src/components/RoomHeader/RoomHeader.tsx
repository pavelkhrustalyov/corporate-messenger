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
import { leaveRoom } from '../../store/roomSlice/roomSlice';
import { MdLogout } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import SearchMessages from '../SearchMessages/SearchMessages';

interface IPropsRoomHeader {
    messages: IMessage[]; 
    room: IRoom | null;
}

const RoomHeader = ({ room }: IPropsRoomHeader) => {

    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { isOpenRoomData } = useSelector((state: RootState) => state.modal);
    const interlocutor = room?.participants.find(p => p._id !== user?._id);
    const navigate = useNavigate();

    const leaveRoomHandler = (roomId: string) => {
        const confirm = window.confirm('Вы хотите покинуть чат?');
        if (confirm) {
            dispatch(leaveRoom(roomId));
            navigate('/');
        }
    };
    

    return (
        <div className={styles['room-header']}>
            <div className={styles.data}>
                {
                    (room?.type === 'group' || room?.type === 'video')
                    ? <Avatar src={`/group_avatars/${room.imageGroup}`} size='middle' />
                    : <Avatar isOnline={interlocutor?.status === "Online"} src={`/avatars/${interlocutor?.avatar}`} size='middle' />
                }

                <div className={styles["user-data"]}>
                    {
                        (room?.type === 'group' || room?.type === 'video')
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
            <SearchMessages />

                {
                    room?.type === "private" ? (
                        <>
                            <Button color="transparent" onClick={() => dispatch(openSideInfo())}>
                                <img onClick={() => dispatch(openRoomDataModal())} className={styles.icon} src="more.svg" alt="Подробнее" />
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
