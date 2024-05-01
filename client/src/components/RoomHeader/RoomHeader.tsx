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
        openRoomDataModal, 
        closeTitleModal, 
        openTitleModal, 
        openProfileModal
 } from '../../store/modalSlice/modalSlice';

import { IRoom } from '../../interfaces/IRoom';
import RoomData from '../RoomData/RoomData';
import Headling from '../Headling/Headling';
import UserList from '../UserList/UserList';
import InviteToGroup from '../InviteToGroup/InviteToGroup';

interface IPropsRoomHeader {
    messages: IMessage[]; 
    room: IRoom | null;
}

const RoomHeader = ({ messages, room }: IPropsRoomHeader) => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { isOpenRoomData, isOpenTitle } = useSelector((state: RootState) => state.modal);

    const interlocutor = room?.participants.find(p => p._id !== user?._id);

    const files = messages
        .filter(message => message.messageType === 'file')
        .map(file => file.content?.filename);
    const images = messages
        .filter(message => message.messageType === 'image')
        .map(image => image.content?.filename);

    const propsData = { roomId: room?._id, images, files, participants: room?.participants };

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
                        ? <div onClick={() => dispatch(openTitleModal())} className={styles.title}>{room.title}</div>
                        : (
                            <>
                                <div onClick={() => dispatch(openProfileModal(interlocutor?._id))} className={styles.title}>{interlocutor?.name} {interlocutor?.surname}</div>
                                { interlocutor?.status === "Offline" ?
                                  <div className={styles.status}>
                                    Был(а)&nbsp;в&nbsp;сети:&nbsp;{getFullDate(new Date(interlocutor.last_seen).toString())}
                                  </div> 
                                : <div className={styles.status}>{interlocutor?.status}</div> 
                                }
                            </>
                        )
                    }
                    {/* {room && room.createdAt} */}
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
                            <Button color="transparent" onClick={() => dispatch(openRoomDataModal())} >
                                <img className={styles.icon} src="more.svg" alt="Подробнее" />
                            </Button>
                        </>
                    ) : (
                        <Button color="transparent" onClick={() => dispatch(openRoomDataModal())} >
                            <FaCirclePlus className={styles.icon}/>
                        </Button>
                    )
                }
            </div>

            {
                room?.type === "private" ? (
                    <>
                        <Modal isOpen={isOpenRoomData} onClose={() => dispatch(closeRoomDataModal())}>
                            <RoomData {...propsData} />
                        </Modal>
                    </>
                ) : (
                    <>
                        <Modal isOpen={isOpenTitle} onClose={() => dispatch(closeTitleModal())}>
                            <RoomData {...propsData} />
                        </Modal>
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