import { Outlet, useNavigate } from 'react-router-dom'; 
import styles from './ChatLayout.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navigation from '../../components/Navigation/Navigation';
import socket from '../../utils/testSocket';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { addRoom, deleteRoom, setRoom, updateRoomImageUI } from '../../store/roomSlice/roomSlice';
import { IRoom } from '../../interfaces/IRoom';
import ProfilePage from '../../pages/ProfilePage/ProfilePage';

const ChatLayout = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { isOpenSideInfo } = useSelector((state: RootState) => state.modal);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (user) {
                socket.emit('user-offline', { userId: user._id });
            }
        };
    2
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
        socket.on("kick-from-group", ({ room, userId }: { room: IRoom, userId: string }) => {
            dispatch(setRoom(room));
            if (user?._id === userId) {
                dispatch(deleteRoom(room._id));
                navigate('/');
            }
        });

        socket.on("leave-group-room", ({ room, userId }: { room: IRoom, userId: string }) => {
            if (room) {
                if (user && user._id === userId) {
                    dispatch(deleteRoom(room._id));
                }
                dispatch(setRoom(room));
            }
        });

        socket.on("unverify-user", (userId: string) => {
            if (user?._id === userId) {
                localStorage.removeItem('user');
                window.location.reload();
            }
        });

        socket.on("change-room-image", (room) => {
            const userExist = room.participants.find((currentUser: string) => 
                (currentUser == user?._id));

            if (userExist) {
                dispatch(updateRoomImageUI(room));
            }
        })

        socket.on("invite-to-room", ({ room, users }: { room: IRoom, users: string[] }) => {
            dispatch(setRoom(room));

            if (user && users.includes(user._id)) {
                dispatch(addRoom(room));
            }
        });

        return () => {
            socket.off('kick-from-group');
            socket.off('invite-to-room');
            socket.off('change-room-image');
            socket.off('leave-group-room');
            socket.off('unverify-user');
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