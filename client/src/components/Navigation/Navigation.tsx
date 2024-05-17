// import Avatar from '../Avatar/Avatar';
import Profile from '../Profile/Profile';
import styles from './Navigation.module.css';
import Modal from '../Modal/Modal';
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
import cn from 'classnames';
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";

import { 
    closeFullImage,
    getProfile,
    openGroupChatModal, 
    openPrivateChatModal, 
    openProfileModal, 
    openSettingsModal, 
    openVideoChatModal,
    } from '../../store/modalSlice/modalSlice';

import {
    closeGroupChatModal,
    closeProfileModal,
    closeSettingsModal,
    closePrivateChatModal,
    closeVideoChatModal
} from '../../store/modalSlice/modalSlice';

import CreateRoom from '../CreatePrivateRoom/CreateRoom';
import { useEffect, useState } from 'react';
import Input from '../UI/Input/Input';
import { themes } from '../../utils/themes';

const Navigation = () => {
    const { 
        isOpenProfile, 
        isOpenGroupChat,
        isOpenSettings,
        isOpenPrivateChat,
        isOpenVideoChat,
        profile,
        userIdForModal,
        isOpenFullImage,
        fullImage
    } = useSelector((state: RootState) => state.modal);
    
    const { user } = useSelector((state: RootState) => state.auth);

    type themesType = "light" | "dark";

    const themeFromLC = localStorage.getItem('theme') as themesType | null;

    const [theme, setTheme] = useState<themesType>(themeFromLC ? themeFromLC : 'light');

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
        setTheme((prev) => prev === 'light' ? 'dark' : 'light');
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

                <label className={cn(styles['label-checked'], {
                        [styles['dark']]: theme === 'dark',
                        [styles['light']]: theme === 'light'
                    })} htmlFor="theme">
                    <div className={styles["round"]}></div>
                    <input
                        id="theme"
                        className={styles.checkbox}
                        name="theme"
                        onChange={changeThemeHandler}
                        type="checkbox"
                        checked={theme === 'dark'}
                    />
                </label>
            </div>
       
            <Button className={styles.logout} 
                onClick={logOutHandler} color="transparent">
                <MdLogout className={styles.icon} />
            </Button>

            {/* modals */}

            <Modal className={styles['profile-modal']} isOpen={isOpenProfile} onClose={() => dispatch(closeProfileModal())}>
                { profile && <Profile user={profile} /> }
            </Modal>

            <Modal isOpen={isOpenGroupChat}
                onClose={() => dispatch(closeGroupChatModal())}>
                <CreateRoom typeRoom='group'/>
            </Modal>

            <Modal isOpen={isOpenPrivateChat} 
                onClose={() => dispatch(closePrivateChatModal())}>
                <CreateRoom typeRoom='private'/>
            </Modal>

            <Modal isOpen={isOpenVideoChat} 
                onClose={() => dispatch(closeVideoChatModal())}>
                video chat create
            </Modal>

            <Modal isOpen={isOpenSettings} 
                onClose={() => dispatch(closeSettingsModal())}>
                settings
            </Modal>

            <Modal isOpen={isOpenFullImage} 
                onClose={() => dispatch(closeFullImage())}>
                { fullImage && <img src={fullImage} /> }
            </Modal>
        </div>
    );
}

export default Navigation;