import { Outlet } from 'react-router-dom'; 
import styles from './ChatLayout.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navigation from '../../components/Navigation/Navigation';
import socket from '../../utils/testSocket';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const ChatLayout = () => {
    const { user } = useSelector((state: RootState) => state.auth);

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
        socket.on('error', (error) => {
            console.error('Socket error:', error);
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

    return (
        <div className={styles['chat-layout']}>
            <Navigation />
            <Sidebar />
            <Outlet />
        </div>
    );
}

export default ChatLayout;