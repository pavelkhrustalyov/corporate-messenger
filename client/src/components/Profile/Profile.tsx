import { useEffect } from 'react';
// import Avatar from '../Avatar/Avatar';
import styles from './Profile.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
// import { getUserById } from '../../store/userSlice/userSlice';
import Avatar from '../Avatar/Avatar';
import Button from '../UI/Button/Button';
import { MdMessage } from 'react-icons/md';
import { useLoadUserQuery } from '../../store/authSlice/authApiSlice';

const Profile = () => {
    const { data: userMe, isLoading, isError } = useLoadUserQuery();

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Произошла ошибка</div>
    }

    return (
        <div className={styles.profile}>

            <div className={styles.data}>
                <Avatar className={styles.avatar} size="large" src={`http://localhost:8080/avatars/${userMe?.avatar}`} />
                <div className={styles.fullname}>
                    <span>{userMe?.surname}</span>
                    <span>{userMe?.name}</span>
                    <span>{userMe?.patronymic}</span>
                </div>
            </div>
           
            <div className="status">Сейчас {userMe?.status === 'Offline' ? 'не в сети' : 'в сети'}</div>
            <div className={styles.isVeridied}>
                { userMe?.isVerified ? 'Аккаунт подтвержден' : 'Аккаунт недействителен' }
            </div>

            <Button color="transparent">
                <MdMessage className={styles['profile-icon']}/>
            </Button>
        </div>
    );
};

export default Profile;