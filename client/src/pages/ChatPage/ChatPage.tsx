import { useEffect, useRef, useState } from 'react';
import styles from './ChatPage.module.css';
import RoomHeader from '../../components/RoomHeader/RoomHeader';
import MessageList from '../../components/MessageList/MessageList';
// import EmojiPicker from 'emoji-picker-react';
import { useParams } from 'react-router-dom';
import { IMessage } from '../../interfaces/IMessage';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { createMessage, getMessages } from '../../store/messageSlice/messageSlice';
import CreateMessageForm from '../../components/CreateMessage/CreateMessage';
// import { Socket } from 'socket.io-client';
import socket from '../../utils/testSocket';

import Loader from '../../components/Loader/Loader';
import { IRoom } from '../../interfaces/IRoom';
import { updateRoom } from '../../store/roomSlice/roomSlice';

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

    useEffect(() => {
        if (roomId) {
            dispatch(getMessages({ roomId, limit }))
        }
    }, [roomId])
        
    useEffect(() => {
        if (!socket) return;

        socket.on("message", (message: IMessage) => {
            dispatch(createMessage(message));
        });

        socket.on("update-room", ({ room }: { room: IRoom }) => {
            dispatch(updateRoom(room));
        });

        return () => {
            socket.off("message");
            socket.off("update-room");
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
    }, [messages]);

    const ScrollToBottom = () => {
        if (container.current) {
            container.current.scrollTop = container.current.scrollHeight;
        }
    };

    return (
        <div className={styles['room-page']}>
            <RoomHeader messages={messages} roomId={roomId} />
            <MessageList ref={container} messages={messages} isLoading={isLoading} />
            {/* <div className={styles.picker}>
                <EmojiPicker
                    theme="dark"
                    className={styles['emoji-picker']}
                    open={isOpenEmoji}
                    onEmojiClick={(data) => setText((text) => `${text} ${data.emoji}`)}
                />
            </div> */}
            <CreateMessageForm roomId={roomId} />
        </div>
    )
}

export default RoomPage;
