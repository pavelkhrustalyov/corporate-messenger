// import Avatar from '../Avatar/Avatar';
import styles from './Navigation.module.css';
import Button from '../UI/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import Avatar from '../Avatar/Avatar';
import { useLogoutMutation } from '../../store/authSlice/authApiSlice';
import { logOut } from '../../store/authSlice/authSlice';
import { useNavigate } from 'react-router-dom';
import { MdGroupAdd, MdVideoChat, MdLogout, MdOutlineSettingsSuggest } from "react-icons/md";
import { AiFillWechat } from "react-icons/ai";
import socket from '../../utils/testSocket';

import { 
    getProfile,
    openGroupChatModal, 
    openPrivateChatModal, 
    openProfileModal, 
    openSettingsModal, 
    openVideoChatModal,
    setTheme,
} from '../../store/modalSlice/modalSlice';

import { useEffect } from 'react';
import { themes } from '../../utils/themes';
import Checkbox from '../UI/Checkbox/Checkbox';
import ModalContainer from '../ModalContainer/ModalContainer';

const Navigation = () => {
    const { userIdForModal, theme } = useSelector((state: RootState) => state.modal);
    const { user } = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (userIdForModal) {
            dispatch(getProfile(userIdForModal));
        }
    }, [userIdForModal])

    const [ logout ] = useLogoutMutation();
    const navigate = useNavigate();

    const logOutHandler = async () => {
        try {
            await logout().unwrap();
            dispatch(logOut())
            navigate('/auth/login');
            socket.emit("user-offline", { userId: user?._id });
        } catch (error) {
            console.log(error);
        }
    }

    const changeThemeHandler = () => {
        dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        localStorage.setItem('theme', theme);
        const themeEntries = Object.entries(themes[theme]);
        
        for (const [key, value] of themeEntries) {
            document.documentElement.style.setProperty(key, value);
        }

    }, [theme])

    return (
        <div className={styles.navigation}>
            {
                user && <Button className={styles.avatar} color="transparent" 
                    onClick={() => dispatch(openProfileModal(user._id))}>
                <Avatar size="middle" src={`/avatars/${user?.avatar}`} />
                </Button>
            }

            <div className={styles['icons-data']}>
                <Button className={styles['button-nav']} color="transparent" 
                    onClick={() => dispatch(openGroupChatModal())}>
                    <MdGroupAdd className={styles.icon} />
                </Button>

                <Button className={styles['button-nav']} color="transparent" 
                    onClick={() => dispatch(openPrivateChatModal())}>
                    <AiFillWechat className={styles.icon} />
                </Button>

                <Button className={styles['button-nav']} color="transparent" 
                    onClick={() => dispatch(openVideoChatModal())}>
                    <MdVideoChat className={styles.icon} />
                </Button>

                <Button className={styles['button-nav']} color="transparent" 
                    onClick={() => dispatch(openSettingsModal())}>
                    <MdOutlineSettingsSuggest className={styles.icon} />
                </Button>

                <Checkbox onChange={changeThemeHandler} theme={theme} />
            </div>

            <Button className={styles.logout} 
                onClick={logOutHandler} color="transparent">
                <MdLogout className={styles.icon} />
            </Button>

            <ModalContainer />
        </div>
    );
}

export default Navigation;