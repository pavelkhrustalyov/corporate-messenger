import { ChangeEvent, useEffect, useRef, useState, KeyboardEvent } from 'react';
import styles from './ChatPage.module.css';
import TextArea from '../../components/UI/TextArea/TextArea';
import RoomHeader from '../../components/RoomHeader/RoomHeader';
import MessageList from '../../components/MessageList/MessageList';
import Button from '../../components/UI/Button/Button';
import EmojiPicker from 'emoji-picker-react';
import { useParams } from 'react-router-dom';
import { IMessage } from '../../interfaces/IMessage';
import { BsFillEmojiSmileFill } from "react-icons/bs";
import Input from '../../components/UI/Input/Input';
import { toast } from 'react-toastify';
import createSocket from '../../utils/socket';
import { useDispatch, useSelector } from 'react-redux';
import { useCreateMessageMutation, useGetMessagesQuery } from '../../store/messageSlice/messageApiSlice';
import { RootState } from '../../store/store';

type IRoomPageParams = {
    roomId: string;
};

const RoomPage = () => {
    const { roomId } = useParams<IRoomPageParams>();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [ text, setText ] = useState<string>('');
    const [currentFile, setCurrentFile] = useState<File | undefined>(undefined);
    const inputRef = useRef(null);

    const [ isOpenEmoji, setIsOpenEmoji ] = useState(false);

    const dispatch = useDispatch();

    const { messages } = useSelector((state: RootState) => state.messages);
    const { data: messagesDataQuery } = useGetMessagesQuery<IRoomPageParams>(roomId);

    
    useCreateMessageMutation

    useEffect(() => {
        socket?.on("message", (data: IMessage) => {


            // setMessages((prevData) => [ ...prevData, data ]);
        });
        return () => {
            socket?.off("message");
        };
    }, [socket])


    useEffect(() => {
        const newSocket = createSocket();
        setSocket(newSocket);

        if (roomId && newSocket) {
            newSocket.emit('joinRoom', roomId);
        }

        return () => {
            newSocket.disconnect();
        };
    }, [roomId]);


    // useEffect(() => {
    //     setMessages([])
    //     // if (inputRef.current) {
    //         inputRef.current.focus();
    //     // }
    // }, [roomId]);

   


    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    };

    const handleKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();

            if (!currentFile && !text.trim()) {
                toast.error('Сообщение не содержит текст и/или файл');
                return;
            }

            const formData = new FormData();
            if (roomId) formData.append('roomId', roomId);
            if (text) formData.append('text', text);
            if (currentFile) formData.append('content', currentFile);
            
            e.currentTarget.style.height = 'auto';
            setText('');
        }
    };

    const sendFile = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setCurrentFile(file);
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

            <form className={styles.controllers} encType="multipart/form-data">
                <Input onChange={sendFile} type="file" name='file' />
                
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
            </form>
        </div>
    )
}

export default RoomPage;
