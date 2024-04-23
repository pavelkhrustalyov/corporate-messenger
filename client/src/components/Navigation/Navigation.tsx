// import Avatar from '../Avatar/Avatar';
import { useState } from 'react';
import Profile from '../Profile/Profile';
import styles from './Navigation.module.css';
import Modal from '../Modal/Modal';
import Button from '../UI/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Avatar from '../Avatar/Avatar';
import { useLogoutMutation } from '../../store/authSlice/authApiSlice';
import { logOut } from '../../store/authSlice/authSlice';
import { NavLink, useNavigate } from 'react-router-dom';
import cn from 'classnames';
import { MdGroupAdd, MdVideoChat, MdManageSearch, MdLogout, MdOutlineSettingsSuggest } from "react-icons/md";

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

            <Button className={styles.avatar} color="transparent" onClick={() => setIsOpen(true)}>
                <Avatar size="middle" src={`/avatars/${user?.avatar}`} />
            </Button>

            <div className={styles['icons-data']}>
                <NavLink className={({ isActive }) => cn(styles.link, {
                    [styles.active]: isActive
                })} to="#" color="transparent">
                    <MdGroupAdd className={styles.icon} />
                </NavLink>

                <NavLink className={({ isActive }) => cn(styles.link, {
                    [styles.active]: isActive
                })} to="/" color="transparent">
                    <MdManageSearch className={styles.icon} />
                </NavLink>

                <NavLink className={({ isActive }) => cn(styles.link, {
                    [styles.active]: isActive
                })} to="/video-chat" color="transparent">
                    <MdVideoChat className={styles.icon} />
                </NavLink>

                <NavLink className={({ isActive }) => cn(styles.link, {
                    [styles.active]: isActive
                })} to="/settings" color="transparent">
                    <MdOutlineSettingsSuggest className={styles.icon} />
                </NavLink>
            </div>
       

            <Button className={styles.logout} onClick={logOutHandler} color="transparent">
                <MdLogout className={styles.icon} />
            </Button>
            
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <Profile />
            </Modal>
        </div>
    )
}

export default Navigation;