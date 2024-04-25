import { useEffect, useState } from 'react';
import Modal from '../Modal/Modal';
import styles from './RoomHeader.module.css';
import Button from '../UI/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import Avatar from '../Avatar/Avatar';
import { getRoomById, updateStatusInRoom } from '../../store/roomSlice/roomSlice';
import Profile from '../Profile/Profile';
import { FaCirclePlus } from "react-icons/fa6";
import { IMessage } from '../../interfaces/IMessage';
import socket from '../../utils/testSocket';
import { getFullDate } from '../../utils/convertDate';

const RoomHeader = ({ roomId, messages }: { roomId: string, messages: IMessage[] }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isOpenTitle, setIsOpenTitle] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { room } = useSelector((state: RootState) => state.rooms);

    useEffect(() => {
        dispatch(getRoomById(roomId))
    }, [roomId, dispatch, getRoomById])

    useEffect(() => {
        socket.on("online", (userId: string) => {
            dispatch(updateStatusInRoom({ userId, roomId, status: "Online", last_seen: Date.now() }));
        });
        socket.on("offline", (userId: string) => {
            dispatch(updateStatusInRoom({ userId, roomId, status: "Offline", last_seen: Date.now() }));
        });
    }, [socket])
    
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
                    : <Avatar src={`/avatars/${interlocutor?.avatar}`} size='middle' />
                }

                <div className={styles["user-data"]}>
                    {
                        room?.type === 'group' 
                        ? <div onClick={() => setIsOpenTitle(true)} className={styles.title}>{room.title}</div>
                        : (
                            <>
                                <div onClick={() => setIsOpenTitle(true)} className={styles.title}>{interlocutor?.name} {interlocutor?.surname}</div>
                                { interlocutor?.status === "Offline" ?
                                  <div className={styles.status}>
                                    Был(а)&nbsp;в&nbsp;сети:&nbsp;{getFullDate(interlocutor?.last_seen.toString())}
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
                            <Button color="transparent" onClick={() => setIsOpen(true)} >
                                <img className={styles.icon} src="more.svg" alt="Подробнее" />
                            </Button>
                        </>
                    ) : (
                        <Button color="transparent" onClick={() => setIsOpen(true)} >
                            <FaCirclePlus className={styles.icon}/>
                        </Button>
                    )
                }
            </div>

            {
                room?.type === "private" ? (
                    <>
                        <Modal isOpen={isOpenTitle} onClose={() => setIsOpenTitle(false)}>
                            { interlocutor && <Profile userId={interlocutor?._id} /> }
                        </Modal>
                        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                            данные о комнате
                            
                            Количество файлов: { fileList.length }
                            Количество Изображений: { imageList.length }
                        </Modal>
                    </>
                    
                ) : (
                    <>
                        <Modal isOpen={isOpenTitle} onClose={() => setIsOpenTitle(false)}>
                            данные о группе
                            Количество файлов: { fileList.length }
                            Количество Изображений: { imageList.length }
                            участники: {room?.participants.length}
                        </Modal>
                        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                            Пригласить в комнату
                        </Modal>
                    </>
                    
                )
            }
        </div>
    )
}

export default RoomHeader;