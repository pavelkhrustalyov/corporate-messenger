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
import socket from '../../utils/testSocket';
import UserList from '../UserList/UserList';

const Navigation = () => {
    const [isOpenProfile, setIsOpenProfile] = useState<boolean>(false);
    const [isOpenGroupChat, setIsOpenGroupChat] = useState<boolean>(false);
    const [isOpenSettings, setIsOpenSettings] = useState<boolean>(false);
    const [isOpenUsers, setIsOpenUsers] = useState<boolean>(false);
    const [isOpenVideoChat, setIsOpenVideoChat] = useState<boolean>(false);

    const { user } = useSelector((state: RootState) => state.auth)
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
                onClick={() => setIsOpenProfile(true)}>
                <Avatar size="middle" src={`/avatars/${user?.avatar}`} />
            </Button>

            <div className={styles['icons-data']}>
                <Button className={styles['button-nav']} color="transparent"
                onClick={() => setIsOpenGroupChat(true)}>
                    <MdGroupAdd className={styles.icon} />
                </Button>

                <Button className={styles['button-nav']} color="transparent"
                onClick={() => setIsOpenUsers(true)}>
                    <MdManageSearch className={styles.icon} />
                </Button>

                <Button className={styles['button-nav']} color="transparent"
                onClick={() => setIsOpenVideoChat(true)}>
                    <MdVideoChat className={styles.icon} />
                </Button>

                <Button className={styles['button-nav']} color="transparent"
                onClick={() => setIsOpenSettings(true)}>
                    <MdOutlineSettingsSuggest className={styles.icon} />
                </Button>
            </div>
       
            <Button className={styles.logout} onClick={logOutHandler} color="transparent">
                <MdLogout className={styles.icon} />
            </Button>

            {/* modals */}
            <Modal isOpen={isOpenProfile} onClose={() => setIsOpenProfile(false)}>
                { user && <Profile userId={user._id} /> }
            </Modal>

            <Modal isOpen={isOpenUsers} onClose={() => setIsOpenUsers(false)}>
                <UserList />
            </Modal>

            <Modal isOpen={isOpenGroupChat} onClose={() => setIsOpenGroupChat(false)}>
                group chat create
            </Modal>

            <Modal isOpen={isOpenVideoChat} onClose={() => setIsOpenVideoChat(false)}>
                video chat create
            </Modal>

            <Modal isOpen={isOpenSettings} onClose={() => setIsOpenSettings(false)}>
                settngs
            </Modal>


        </div>
    )
}

export default Navigation;