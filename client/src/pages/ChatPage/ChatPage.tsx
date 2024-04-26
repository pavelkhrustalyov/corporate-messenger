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
import { getRoomById, setRoom, updateRoom, updateStatusInRoom, updateStatusInRooms } from '../../store/roomSlice/roomSlice';

type IRoomPageParams = {
    roomId: string;
};

const RoomPage = () => {
    const { roomId } = useParams<IRoomPageParams>();
    // const [socket, setSocket] = useState<Socket | null>(null);
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
        if (!socket) return;
        
        const handleOnline = (userId: string) => {
            dispatch(updateStatusInMessage({ userId, status: "Online" }));
            dispatch(updateStatusInRooms({ userId, status: "Online" }));
            dispatch(updateStatusInRoom({ userId, roomId: room?._id, status: "Online", last_seen: Date.now() })); // а так нет
        };
    
        const handleOffline = (userId: string) => {
            dispatch(updateStatusInMessage({ userId, status: "Offline" }));
            dispatch(updateStatusInRooms({ userId, status: "Offline" }));
            dispatch(updateStatusInRoom({ userId, roomId: room?._id, status: "Offline", last_seen: Date.now() }));
        };
    
        socket.on("online", handleOnline);
        socket.on("offline", handleOffline);
    
        return () => {
            socket.off("online", handleOnline);
            socket.off("offline", handleOffline);
        };
    }, [socket, room]);
        
    useEffect(() => {
        if (!socket) return;

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
            socket.off("online");
            socket.off("offline");
        };
    }, [socket])

    useEffect(() => {
        if (roomId && socket) {
            socket.emit('join-room', roomId);
        }

        return () => {
            socket.off('join-room');
            socket.emit("leave-room", roomId);
        };
    }, [socket, roomId]);

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
                messages={messages} 
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
