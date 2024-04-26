import { useEffect } from 'react';
// import Avatar from '../Avatar/Avatar';
import styles from './Profile.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
// import { getUserById } from '../../store/userSlice/userSlice';
import Avatar from '../Avatar/Avatar';
import Button from '../UI/Button/Button';
import Loader from '../Loader/Loader';
import { getUserById } from '../../store/userSlice/userSlice';
import Headling from '../Headling/Headling';
import { FaPen, FaMessage, FaCircleUser, FaCalendarDays, FaEnvelope } from "react-icons/fa6";
import { getFullDate } from '../../utils/convertDate';
import { createPrivateRoom } from '../../store/roomSlice/roomSlice';

const Profile = ({ userId }: { userId: string }) => {
    const { user, isLoading, isError } = useSelector((state: RootState) => state.users);
    const { user: currentUser } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const isMyPage = currentUser?._id === user?._id;

    // const createPrivateRoomHandler = (userId: string) => {
    //     const isConfirm = confirm("Вы хотите создать диалог?");
    //     if (isConfirm)
    //         dispatch(createPrivateRoom({ lastMessage: '', userId })); // пофиксить
    // }

    useEffect(() => {
        dispatch(getUserById(userId));
    }, [userId, dispatch]);

    if (isLoading) {
        return <Loader />
    }

    if (isError) {
        return <div>Произошла ошибка</div>
    }

    return (
        <div className={styles.profile}>
            <Headling className={styles.title} element="h3">Информация</Headling>
            <div className={styles.content}>
                <Avatar className={styles.avatar} size="large" src={`/avatars/${user?.avatar}`} />
                <div className={styles.data}>
                    <div
                        className={styles.fullname}>
                        {user?.surname} {user?.name} {user?.patronymic}
                    </div>
                    { user?.status === "Offline" ?
                        <div className={styles.status}>
                            Был(а)&nbsp;в&nbsp;сети:&nbsp;{getFullDate(user?.last_seen.toString())}
                        </div>
                    : <div className={styles.status}>{user?.status}</div> 
                    }
                </div>
            </div>

            <ul className={styles['info-list']}>
                <li className={styles['info-item']}>
                    <div className={styles['info-title']}>
                        <FaCircleUser/>
                        <span className={styles.position}>Должность:</span>
                    </div>
                    <span>{user?.position}</span>
                    
                </li>
                <li className={styles['info-item']}>
                    <div className={styles['info-title']}>
                        <FaCalendarDays/>
                        <span className={styles.position}>Дата рождения:</span>
                    </div>
                    {/* <span>{user?.birthday.toISOString()}</span> */}
                    
                </li>
                <li className={styles['info-item']}>
                    <div className={styles['info-title']}>
                        <FaEnvelope/>
                        <span className={styles.position}>Почта:</span>
                    </div>
                    <span>{user?.email}</span>
                </li>
            </ul>

            <div className={styles.controls}>
                {
                    isMyPage && <Button color="primary">
                        <FaPen/>
                        <span>Редактировать профиль</span>
                    </Button>
                }
            </div>

        </div>
    );
};

export default Profile;