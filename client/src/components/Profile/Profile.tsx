import styles from './Profile.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Avatar from '../Avatar/Avatar';
import Button from '../UI/Button/Button';
import { FaPen, FaCircleUser, FaCalendarDays, FaEnvelope, FaPhone } from "react-icons/fa6";
import { getFullDate } from '../../utils/convertDate';
import { IUser } from '../../interfaces/IUser';
import { memo } from 'react';

const Profile = ({ user }: { user: IUser }) => {
    const { user: currentUser } = useSelector((state: RootState) => state.auth);
    const isMyPage = currentUser?._id === user?._id;
    console.log(user);

    if (!user) return;

    return (
        <div className={styles.profile}>
            <div className={styles.content}>
                <Avatar className={styles.avatar} size="large" src={`/avatars/${user?.avatar}`} />
                <div className={styles.data}>
                    <div
                        className={styles.fullname}>
                        {user?.surname} {user?.name} {user?.patronymic}
                    </div>
                    { user?.status === "Offline" ? "Offline"
                        // <div className={styles.status}>
                        //     {/* Был(а)&nbsp;в&nbsp;сети:&nbsp;{getFullDate(user?.last_seen.toString())} */}
                        // </div>
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
                <li className={styles['info-item']}>
                    <div className={styles['info-title']}>
                        <FaPhone />
                        <span className={styles.position}>Телефон:</span>
                    </div>
                    {/* <span>{user?.phone}</span> */}
                    <span>89969316693</span>
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

export default memo(Profile);