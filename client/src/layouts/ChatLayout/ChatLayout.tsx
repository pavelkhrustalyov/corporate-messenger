import { Outlet } from 'react-router-dom'; 
import styles from './ChatLayout.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navigation from '../../components/Navigation/Navigation';
import socket from '../../utils/testSocket';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { updateStatusInRooms } from '../../store/roomSlice/roomSlice';

const ChatLayout = () => {
    const { user } = useSelector((state: RootState) => state.auth);
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
            socket.emit('user-online', { userId: user?._id });
        });

        socket.on('disconnect', () => {
            socket.emit('user-offline', { userId: user?._id });
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    useEffect(() => {
        socket.on("offline", (userId) => {
            dispatch(updateStatusInRooms({ userId, status: "Offline" }));
        })

        socket.on("online", (userId) => {
            dispatch(updateStatusInRooms({ userId, status: "Online" }));
        })

        return () => {
            socket.off("offline");
            socket.off("online");
        }
    }, [socket, dispatch, updateStatusInRooms]);


    return (
        <div className={styles['chat-layout']}>
            <Navigation />
            <Sidebar />
            <Outlet />
        </div>
    );
}

export default ChatLayout;