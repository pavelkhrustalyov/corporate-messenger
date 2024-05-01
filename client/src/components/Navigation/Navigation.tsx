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
import { useNavigate } from 'react-router-dom';
import { MdGroupAdd, MdVideoChat, MdLogout, MdOutlineSettingsSuggest } from "react-icons/md";
import { AiFillWechat } from "react-icons/ai";
import socket from '../../utils/testSocket';

import { 
    openGroupChatModal, 
    openPrivateChatModal, 
    openProfileModal, 
    openSettingsModal, 
    openUsersModal, 
    openVideoChatModal } from '../../store/modalSlice/modalSlice';

import {
    closeGroupChatModal,
    closeProfileModal,
    closeSettingsModal,
    closePrivateChatModal,
    closeVideoChatModal
} from '../../store/modalSlice/modalSlice';
import Form from '../Form/Form';
import Input from '../UI/Input/Input';
import CreateRoom from '../CreatePrivateRoom/CreateRoom';


const Navigation = () => {
    
    const { user } = useSelector((state: RootState) => state.auth)
    const { 
        isOpenProfile, 
        isOpenGroupChat,
        isOpenSettings,
        isOpenPrivateChat,
        isOpenVideoChat,
        userIdFromModal } = useSelector((state: RootState) => state.modal);

    const dispatch = useDispatch();
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

    return (
        <div className={styles.navigation}>
            <Button className={styles.avatar} color="transparent" 
                onClick={() => dispatch(openProfileModal(user?._id))}>
                <Avatar size="middle" src={`/avatars/${user?.avatar}`} />
            </Button>

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
            </div>
       
            <Button className={styles.logout} 
                onClick={logOutHandler} color="transparent">
                <MdLogout className={styles.icon} />
            </Button>

            {/* modals */}

            <Modal className={styles['profile-modal']} isOpen={isOpenProfile} onClose={() => dispatch(closeProfileModal())}>
                { userIdFromModal && <Profile userId={userIdFromModal} /> }
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
                settngs
            </Modal>
        </div>
    );
}

export default Navigation;