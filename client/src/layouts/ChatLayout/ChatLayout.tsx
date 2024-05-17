import { Outlet } from 'react-router-dom'; 
import styles from './ChatLayout.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navigation from '../../components/Navigation/Navigation';
import socket from '../../utils/testSocket';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { addRoom, deleteRoom, setRoom } from '../../store/roomSlice/roomSlice';
import { IRoom } from '../../interfaces/IRoom';
import ProfilePage from '../../pages/ProfilePage/ProfilePage';

const ChatLayout = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { isOpenSideInfo } = useSelector((state: RootState) => state.modal);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (user) {
                socket.emit('user-offline', { userId: user._id });
            }
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                socket.emit('user-online', { userId: user?._id });
            } else {
                socket.emit('user-offline', { userId: user?._id });
            }
        };
    
        document.addEventListener("visibilitychange", handleVisibilityChange);
    
        return () => {
            window.removeEventListener('beforeunload', handleVisibilityChange);
        };
    }, []);
    
    useEffect(() => {
        socket.on('connect', () => {
            console.log('connect');
            socket.emit('user-online', { userId: user?._id });
        });

        socket.on('disconnect', () => {
            console.log('disconnect');
            socket.emit('user-offline', { userId: user?._id });
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    useEffect(() => {
        socket.on("kick-from-group", ({ room, userId }: { room: IRoom, userId: string }) => {
            dispatch(setRoom(room));
            if (user?._id === userId) {
                dispatch(deleteRoom(room._id));
            }
        });

        socket.on("invite-to-room", ({ room, users }: { room: IRoom, users: string[] }) => {
            dispatch(setRoom(room));

            if (user && users.includes(user._id)) {
                dispatch(addRoom(room));
            }
        });

        return () => {
            socket.off('kick-from-group');
            socket.off('invite-to-room');
        }

    }, [])

    return (
        <div className={styles['chat-layout']}>
            <Navigation />
            <Sidebar />
            <Outlet />
            { isOpenSideInfo && <ProfilePage />}
        </div>
    );
}

export default ChatLayout;