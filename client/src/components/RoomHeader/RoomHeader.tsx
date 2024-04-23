import { useEffect, useState } from 'react';
import Modal from '../Modal/Modal';
import styles from './RoomHeader.module.css';
import Button from '../UI/Button/Button';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import Avatar from '../Avatar/Avatar';
import { getRoomById } from '../../store/roomSlice/roomSlice';
import Loader from '../Loader/Loader';

const RoomHeader = ({ roomId }: { roomId: string }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { room, isLoading } = useSelector((state: RootState) => state.rooms);

    useEffect(() => {
        dispatch(getRoomById(roomId))
    }, [roomId, dispatch, getRoomById])

    const interlocutor = room?.participants.find(p => p._id !== user?._id);
    
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
                        ? <div className={styles.title}>{room.title}</div>
                        : (
                            <>
                                <div className={styles.title}>{interlocutor?.name} {interlocutor?.surname}</div>
                                <div className={styles.status}>{interlocutor?.status}</div>
                            </>
                        )
                    }
                    {/* {room && room.createdAt} */}
                </div>
            </div>

            <div className={styles.utils}>
                <Button color="transparent" >
                    <img className={styles.icon} src="phone.svg" alt="Позвонить" />
                </Button>
                <Button color="transparent" >
                    <img className={styles.icon} src="video.svg" alt="начать видеочат" />
                </Button>

                <Button color="transparent" onClick={() => setIsOpen(true)} >
                    <img className={styles.icon} src="more.svg" alt="Подробнее" />
                </Button>
            </div>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                данные о комнате
            </Modal>
        </div>
    )
}

export default RoomHeader;