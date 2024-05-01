import { useEffect, useRef, useState } from 'react';
import styles from './ChatPage.module.css';
import RoomHeader from '../../components/RoomHeader/RoomHeader';
import MessageList from '../../components/MessageList/MessageList';
import { useParams } from 'react-router-dom';
import { IMessage } from '../../interfaces/IMessage';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { createMessage, getMessages, updateStatusInMessage } from '../../store/messageSlice/messageSlice';
import CreateMessageForm from '../../components/CreateMessage/CreateMessage';
import socket from '../../utils/testSocket';
import { IRoom } from '../../interfaces/IRoom';
import { getRoomById, updateRoom, updateStatusInRoom } from '../../store/roomSlice/roomSlice';

type IRoomPageParams = {
    roomId: string;
};

const RoomPage = () => {
    const { roomId } = useParams<IRoomPageParams>();
    const dispatch = useDispatch<AppDispatch>();
    const [limit, setLimit] = useState(20);
    const container = useRef<HTMLDivElement>(null);
    const { messages } = useSelector((state: RootState) => state.messages);
    const { isLoading } = useSelector((state: RootState) => state.messages);
    const { room } = useSelector((state: RootState) => state.rooms);

    useEffect(() => {
        if (roomId) {
            dispatch(getRoomById(roomId))
            dispatch(getMessages({ roomId, limit }))
        }
    }, [roomId, dispatch])

    useEffect(() => {
        const handleOnline = (userId: string) => {
            dispatch(updateStatusInMessage({ userId, status: "Online" }));
            dispatch(updateStatusInRoom({ userId, roomId: room?._id, status: "Online", last_seen: Date.now() })); // а так нет
        };
    
        const handleOffline = (userId: string) => {
            dispatch(updateStatusInMessage({ userId, status: "Offline" }));
            dispatch(updateStatusInRoom({ userId, roomId: room?._id, status: "Offline", last_seen: Date.now() }));
        };
    
        socket.on("online", handleOnline);
        socket.on("offline", handleOffline);
    
        return () => {
            socket.off("online", handleOnline);
            socket.off("offline", handleOffline);
        };
    }, [room]);

    useEffect(() => {
        socket.on("message", (message: IMessage) => {
            dispatch(createMessage(message));
            setTimeout(ScrollToBottom, 0);
        });

        socket.on("update-room", ({ room }: { room: IRoom }) => {
            dispatch(updateRoom(room));
        });

        return () => {
            socket.off("message");
            socket.off("update-room");
            socket.off("create-room");
        };
    }, [])

    useEffect(() => {
        if (roomId && socket) {
            socket.emit('join-room', roomId);
        }

        return () => {
            socket.off('join-room');
            socket.emit("leave-room", roomId);
        };
    }, [roomId]);

    useEffect(() => {
        ScrollToBottom();
    }, [isLoading]);

    const ScrollToBottom = () => {
        if (container.current) {
            container.current.scrollTop = container.current.scrollHeight;
        }
    };

    return (
        <div className={styles['room-page']}>
            <RoomHeader 
                room={room} 
                messages={messages && messages} 
            />
            <MessageList 
                ref={container} 
                room={room} 
                messages={messages} 
                isLoading={isLoading}
            />
            <CreateMessageForm roomId={roomId} />
        </div>
    )
}

export default RoomPage;
