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

interface IPropsRoomHeader {
    messages: IMessage[]; 
    room: IRoom | null;
}

const RoomHeader = ({ messages, room }: IPropsRoomHeader) => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { isOpenRoomData, isOpenTitle } = useSelector((state: RootState) => state.modal);

    const interlocutor = room?.participants.find(p => p._id !== user?._id);

    const messagesFiles = messages.filter(message => message.messageType === 'file');
    const messagesImage = messages.filter(message => message.messageType === 'image');
    const imageList = messagesImage.map(image => image.content?.filename);
    const fileList = messagesFiles.map(image => image.content?.filename);

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
                            данные о комнате
                            
                            Количество файлов: { fileList.length }
                            Количество Изображений: { imageList.length }
                        </Modal>
                    </>
                    
                ) : (
                    <>
                        <Modal isOpen={isOpenTitle} onClose={() => dispatch(closeTitleModal())}>
                            данные о группе
                            Количество файлов: { fileList.length }
                            Количество Изображений: { imageList.length }
                            участники: {room?.participants.length}
                        </Modal>
                        <Modal isOpen={isOpenRoomData} onClose={() => dispatch(closeRoomDataModal())}>
                            Пригласить в комнату
                        </Modal>
                    </>
                    
                )
            }
        </div>
    )
}

export default RoomHeader;