// import Avatar from '../Avatar/Avatar';
import { useState } from 'react';
import Profile from '../Profile/Profile';
import styles from './Navigation.module.css';
import { MdMenu } from "react-icons/md";
import Modal from '../Modal/Modal';
import Button from '../UI/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Avatar from '../Avatar/Avatar';
import { useLogoutMutation } from '../../store/authSlice/authApiSlice';
import { logOut } from '../../store/authSlice/authSlice';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { user } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch();
    const [ logout ] = useLogoutMutation();
    const navigate = useNavigate();
    
    const logOutHandler = async () => {
        try {
            await logout().unwrap();
            dispatch(logOut())
            navigate('/auth/login');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styles.navigation}>
            <Button className={styles['btn-more']} color="transparent" onClick={() => setIsOpen(true)}>
                <Avatar size="small" src={`http://localhost:8080/avatars/${user?.avatar}`} />
                <div className={styles['name']}>{user?.name} {user?.surname}</div>
            </Button>
            <Button onClick={logOutHandler} color='primary'>Выйти</Button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <Profile />
            </Modal>
        </div>
    )
}

export default Navigation;