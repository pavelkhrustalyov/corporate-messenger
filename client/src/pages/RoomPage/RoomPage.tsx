import { useEffect, useRef, useState } from 'react';
import styles from './RoomPage.module.css';
import RoomHeader from '../../components/RoomHeader/RoomHeader';
import MessageList from '../../components/MessageList/MessageList';
import { useParams } from 'react-router-dom';
import { IMessage } from '../../interfaces/IMessage';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { createMessage, getMessages, updateMessage, updateMessages, updateStatusInMessage } from '../../store/messageSlice/messageSlice';
import CreateMessageForm from '../../components/CreateMessage/CreateMessage';
import socket from '../../utils/testSocket';
import { IRoom } from '../../interfaces/IRoom';
import { getRoomById, updateRoom, updateStatusInRoom } from '../../store/roomSlice/roomSlice';
import { readMessages } from '../../store/messageSlice/messageSlice';
import { TimeoutType } from '../../types/types';
import VideoConference from '../../components/VideoConference/VideoConference';
import Button from '../../components/UI/Button/Button';

type IRoomPageParams = {
    roomId: string;
};

const RoomPage = () => {
    const { roomId } = useParams<IRoomPageParams>();
    const dispatch = useDispatch<AppDispatch>();
    const [limit, setLimit] = useState(50);
    const container = useRef<HTMLDivElement>(null);
    const { messages } = useSelector((state: RootState) => state.messages);
    const { isLoading } = useSelector((state: RootState) => state.messages);
    const { room } = useSelector((state: RootState) => state.rooms);

    useEffect(() => {
        if (roomId) {
            dispatch(getRoomById(roomId))
            dispatch(getMessages({ roomId, limit }))
            dispatch(readMessages({ roomId, limit }))
            setTimeout(ScrollToBottom, 0);
        }
    }, [roomId, dispatch])

    useEffect(() => {
        if (roomId)
            dispatch(getMessages({ roomId, limit }))
    }, [limit]);


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
        socket.on("message", ({ message, roomId }: { message: IMessage, roomId: string }) => {
            dispatch(createMessage(message));
            setTimeout(ScrollToBottom, 0);
            socket.emit('is-received', ({ roomId, messageId: message._id }));
        });

        socket.on("update-room", ({ room }: { room: IRoom }) => {
            dispatch(updateRoom(room));
        });

        return () => {
            socket.off("message");
            socket.off("update-room");
            socket.off("is-received");
        };
    }, [])

    useEffect(() => {
        let timeout: TimeoutType;

        socket.on('read-messages', ({ room, messages }) => {
            messages.reverse();

            timeout = setTimeout(() => {
                dispatch(updateMessages(messages));
                dispatch(updateRoom(room));
            }, 500)

            setTimeout(ScrollToBottom, 0);
        })

        return () => {
            socket.off('read-messages');
            clearTimeout(timeout);
        }
    }, [roomId, dispatch, socket])


    useEffect(() => {
        let timeout: TimeoutType;

        socket.on('message-received', ({ message, room }: 
            { room: IRoom, users: string[], message: IMessage }) => {

            timeout = setTimeout(() => {
                dispatch(updateMessage(message));
                dispatch(updateRoom(room));
            }, 500)
        })

        return () => {
            socket.off('message-received');
            clearTimeout(timeout);
        }
    }, [])

    useEffect(() => {
        socket.emit('join-room', roomId);

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
            {
                room?.type !== "video" && 
                    <Button 
                        className={styles['more-messsage']} 
                        onClick={() => setLimit(prevLimit => prevLimit + 10)} 
                        color='primary'>Загрузить сообщения
                    </Button>
            }
            
            
            <RoomHeader 
                room={room}
                messages={messages && messages}
            />

            {
                room && room?.type === "video" ? 
                    <VideoConference 
                        roomId={room._id} 
                        participants={room.participants.map((p) => p._id)} 
                    /> :
                (
                    <>
                        <MessageList
                        ref={container}
                        room={room}
                        messages={messages}
                        isLoading={isLoading}
                    />
                        <CreateMessageForm roomId={roomId} />
                    </>
                )
            }
        </div>
    )
}

export default RoomPage;
