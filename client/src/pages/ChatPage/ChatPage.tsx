import { useEffect, useState } from 'react';
import styles from './ChatPage.module.css';
import RoomHeader from '../../components/RoomHeader/RoomHeader';
import MessageList from '../../components/MessageList/MessageList';
// import EmojiPicker from 'emoji-picker-react';
import { useParams } from 'react-router-dom';
import { IMessage } from '../../interfaces/IMessage';
import createSocket from '../../utils/socket';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { createMessage, getMessages } from '../../store/messageSlice/messageSlice';
import CreateMessageForm from '../../components/CreateMessage/CreateMessage';
import { Socket } from 'socket.io-client';
import Loader from '../../components/Loader/Loader';
import { IRoom } from '../../interfaces/IRoom';
import { updateRoom } from '../../store/roomSlice/roomSlice';

type IRoomPageParams = {
    roomId: string;
};

const RoomPage = () => {
    const { roomId } = useParams<IRoomPageParams>();
    const [socket, setSocket] = useState<Socket | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    const { messages } = useSelector((state: RootState) => state.messages);
    const { isLoading } = useSelector((state: RootState) => state.messages);

    useEffect(() => {
        if (roomId) {
            dispatch(getMessages(roomId))
        }
    }, [roomId])
        
    useEffect(() => {
        if (!socket) return;

        socket.on("message", (message: IMessage) => {
            dispatch(createMessage(message));
        });

        socket.on("update-room", ({ room }: { room: IRoom }) => {
            console.log(room)
            dispatch(updateRoom(room));
        });

        return () => {
            socket.off("message");
            socket.off("update-room");
        };
    }, [socket])

    useEffect(() => {
        const newSocket = createSocket();
        setSocket(newSocket);

        if (roomId && newSocket) {
            newSocket.emit('join-room', roomId);
        }

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [roomId]);

    return (
        <div className={styles['room-page']}>
            <RoomHeader roomId={roomId} />
            <MessageList messages={messages} isLoading={isLoading} />
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
