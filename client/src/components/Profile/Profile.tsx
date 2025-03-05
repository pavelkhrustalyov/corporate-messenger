import styles from './Profile.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import Avatar from '../Avatar/Avatar';
import Button from '../UI/Button/Button';
import { FaPen, FaCircleUser, FaCalendarDays, FaEnvelope, FaPhone } from "react-icons/fa6";
import { IUser } from '../../interfaces/IUser';
import { memo } from 'react';
import { openEditProfile } from '../../store/modalSlice/modalSlice';

const Profile = ({ user }: { user: IUser }) => {
    if (!user) return;

    const { user: currentUser } = useSelector((state: RootState) => state.auth);
    const isMyPage = currentUser?._id === user?._id;
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className={styles.profile}>
            <div className={styles.content}>
                <Avatar className={styles.avatar} size="large" src={`/avatars/${user?.avatar}`} />
                <div className={styles.data}>
                    <div
                        className={styles.fullname}>
                        {user?.surname} {user?.name} {user?.patronymic}
                    </div>
                    { user?.status === "Offline" ? "Offline" :
                     <div className={styles.status}>{user?.status}</div> 
                    }
                </div>
            </div>

            <ul className={styles['info-list']}>
                <li className={styles['info-item']}>
                    <div className={styles['info-title']}>
                        <FaCircleUser/>
                        <span className={styles['info-title']}>Должность:</span>
                    </div>
                    {/* <span>{user?.position}</span> */}
                    <span>UI/UX Designer</span>
                </li>
                <li className={styles['info-item']}>
                    <div className={styles['info-title']}>
                        <FaPhone />
                        <span className={styles['info-title']}>Пол:</span>
                    </div>
                    {/* <span>{user?.gender === "male" ? "Мужской" : "Женский"}</span> */}
                    <span>Мужской</span>
                </li>
                <li className={styles['info-item']}>
                    <div className={styles['info-title']}>
                        <FaCalendarDays/>
                        <span className={styles['info-title']}>Дата рождения:</span>
                    </div>
                    <span>{new Date(user?.dateOfBirthday).toISOString().slice(0, 10)}</span>
                </li>
                <li className={styles['info-item']}>
                    <div className={styles['info-title']}>
                        <FaEnvelope/>
                        <span className={styles['info-title']}>Почта:</span>
                    </div>
                    {/* <span>{user?.email}</span> */}
                    <span>dimaIv90@mail.ru</span>
                </li>
                <li className={styles['info-item']}>
                    <div className={styles['info-title']}>
                        <FaPhone />
                        <span className={styles['info-title']}>Телефон:</span>
                    </div>
                    {/* <span>{user?.phone}</span> */}
                    <span>8 996-943-55-02</span>
                </li>
            </ul>
            
            <div className={styles.controls}>
                {
                    isMyPage && <Button onClick={() => dispatch(openEditProfile())} color="primary">
                        <FaPen/>
                        <span>Редактировать профиль</span>
                    </Button>
                }
            </div>

        </div>
    );
};

export default memo(Profile);