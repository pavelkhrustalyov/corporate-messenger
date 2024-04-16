import { ChangeEvent, useEffect, useRef, useState, KeyboardEvent } from 'react';
import io, { Socket } from 'socket.io-client';
import styles from './ChatPage.module.css';
import TextArea from '../../components/UI/TextArea/TextArea';
import RoomHeader from '../../components/RoomHeader/RoomHeader';
import MessageList from '../../components/MessageList/MessageList';
import Button from '../../components/UI/Button/Button';
import EmojiPicker from 'emoji-picker-react';
import { useParams } from 'react-router-dom';
import { IMessage } from '../../interfaces/IMessage';
import { BsArrowRightSquareFill, BsFillEmojiSmileFill } from "react-icons/bs";
import Input from '../../components/UI/Input/Input';

type IRoomPageParams = {
    roomId: string;
};

const RoomPage = () => {
    const { roomId } = useParams<IRoomPageParams>();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [ messages, setMessages ] = useState<IMessage[]>([]);
    const [ text, setText ] = useState<string>('');
    const inputRef = useRef(null);

    const [ isOpenEmoji, setIsOpenEmoji ] = useState(false);

    useEffect(() => {
        const newSocket = io('http://localhost:8080');
        setSocket(newSocket);

        if (roomId && newSocket) {
            console.log("joinRoom", roomId);
            newSocket.emit('joinRoom', roomId);
        }

        return () => {
            newSocket.disconnect();
        };
    }, [roomId]);

    useEffect(() => {
        setMessages([])
        inputRef.current.focus();
    }, [roomId]);

    useEffect(() => {
        socket?.on("msg", ({ text, roomId, id }) => {
            const message: IMessage = {
                _id: `${id}-${Date.now()}`,
                my: socket.id === id,
                roomId,
                senderId: {
                    _id: id,
                    avatar: "https://pixelbox.ru/wp-content/uploads/2021/05/ava-vk-animal-91.jpg",
                    name: "Valeryi",
                    surname: "Nikiforov",
                    login: "valeryi_nikiforov",
                    status: "Offline",
                },
                recipientId: {
                    _id: "1",
                    avatar: "https://pixelbox.ru/wp-content/uploads/2021/05/ava-vk-animal-91.jpg",
                    name: "Pavel",
                    surname: "Khrustalyov",
                    login: "pavel_khrustalyov",
                    status: "Online",
                },
                messageType: 'text',
                isRead: true,
                createdAt: new Date(Date.now()),
                content: text
            };
            setMessages((prevData) => [ ...prevData, message ]);
        });
        return () => {
            socket?.off("msg");
        };
    }, [socket])

    const toSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (text.trim() !== '') {
           socket?.emit('message', { text: text.trim(), roomId });
        }
        setText('');
     };

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (text.trim() !== '') {
            socket?.emit('message', { text: text.trim(), roomId });
            setText('');
            e.currentTarget.style.height = 'auto';
          }
        }
      };

    const sendFile = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith('image')) {
                console.log(file)
                console.log('изображение');
            } else {
                console.log('file');
            }
        }
    }
    
    return (
        <div className={styles['room-page']}>
            <RoomHeader roomId={roomId} />
            <MessageList messages={messages} />
            <div className={styles.picker}>
                <EmojiPicker
                    theme="dark"
                    className={styles['emoji-picker']}
                    open={isOpenEmoji}
                    onEmojiClick={(data) => setText((text) => `${text} ${data.emoji}`)}
                />
            </div>

            <form onSubmit={toSubmit} className={styles.controllers}>
                <Input onChange={sendFile} type="file" />

                <TextArea
                    className={styles['input-field']}
                    onFocus={() => setIsOpenEmoji(false)}
                    ref={inputRef}
                    value={text}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange} 
                    type="text"
                    placeholder='Введите сообщение...'
                />
                <Button
                    color='transparent'
                    onMouseEnter={() => setIsOpenEmoji(true)}
                >
                    <BsFillEmojiSmileFill className={styles.smile} />
                </Button>

                <Button color='transparent'>
                    <BsArrowRightSquareFill className={styles.submit}/>
                </Button>
            </form>
        </div>
    )
}

export default RoomPage;
