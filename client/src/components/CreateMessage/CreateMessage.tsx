import styles from './CreateMessage.module.css';
import { BsFillEmojiSmileFill } from "react-icons/bs";
import { ToastContainer, toast } from 'react-toastify';
import Button from '../../components/UI/Button/Button';
// import TextArea from '../../components/UI/TextArea/TextArea';
import Input from '../../components/UI/Input/Input';
import Form from '../Form/Form';
import { FaPencil } from "react-icons/fa6";

import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useCreateMessageMutation } from '../../store/messageSlice/messageApiSlice';
import { IPropsCreateMessage } from './IPropsCreateMessage';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { typingData } from '../../types/types';
import socket from '../../utils/testSocket';

const CreateMessageForm = ({ roomId }: IPropsCreateMessage) => {
   
    const [currentFile, setCurrentFile] = useState<File | undefined>(undefined);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [ createMessageQuery, { isLoading } ] = useCreateMessageMutation();
    const [ text, setText ] = useState<string>('');
    const [dataTyping, setDataTyping] = useState<typingData>();
    const [ isOpenEmoji, setIsOpenEmoji ] = useState(false);
    const { user } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        if (roomId && socket) {
            socket.emit('join-room', roomId);
        }
        socket.on('set-typing', (data: typingData) => {
            setDataTyping(data);
        });
        return () => {
            socket.off("set-typing")
            socket.off('join-room');
            socket.emit('leave-room');
        }
    }, [socket, roomId])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            socket?.emit('typing', { roomId, isTyping: false, name: user && user.name });
        }, 1500);

        return () => clearTimeout(timeoutId);
    }, [text])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, style, scrollHeight } = e.target;
        setText(value);
        style.height = 'auto';
        if (value) {
            socket?.emit('typing', { roomId, isTyping: true, name: user && user.name });
        } else {
            socket?.emit('typing', { roomId, isTyping: false, name: user && user.name });
        }
    };

    const sendFile = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setCurrentFile(file);
        if (inputRef.current) {
            inputRef.current.focus();
        }
        if (file) {
            toast.info(`${file.name} готов к отправке`)
        }
    }

    const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
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

            try {
                await createMessageQuery(formData).unwrap(); // здесь поправить ошибку типизации
                setCurrentFile(undefined);
                setText('');
            } catch (error) {
                if (error && error.data) {
                    toast.error(error.data.message)
                } else {
                    toast.error("Ошибка сервера")
                }
            }
            
            e.currentTarget.style.height = 'auto';
        }
    };

    return (
        <>
            <Form className={styles.form} encType="multipart/form-data">
                
            { dataTyping && dataTyping.isTyping && <div className={styles.typing}> 
                {dataTyping.name} печатает... <FaPencil /></div> 
            }

                <div className={styles['form-controls']}>
                    <Button
                        type='button'
                        color='transparent'
                        onMouseEnter={() => setIsOpenEmoji(true)}
                    >
                        <img className={styles.smile} src="smiles.svg" alt="Smile" />
                    </Button>
                    <ToastContainer />
                    <Input
                        className={styles['input-field']}
                        onFocus={() => setIsOpenEmoji(false)}
                        ref={inputRef}
                        value={text}
                        onKeyDown={handleKeyDown}
                        onChange={handleChange} 
                        type="text"
                        placeholder='Введите сообщение...'
                    />
                    <div className={styles.file}>
                        <Input className={styles.file} onChange={sendFile} type="file" name='file' />
                    </div>
                    <Button
                        type='button'
                        color='primary'>
                        <img className={styles.micro} src="micro.svg" alt="записать голосовое"
                    />
                    </Button>
                </div>               
            </Form>
        </>
            
    );
};

export default CreateMessageForm;