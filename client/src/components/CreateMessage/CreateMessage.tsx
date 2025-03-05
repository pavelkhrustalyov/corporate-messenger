import styles from './CreateMessage.module.css';
import { ToastContainer, toast } from 'react-toastify';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Form from '../Form/Form';
import { AiFillCloseCircle } from "react-icons/ai";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useCreateMessageMutation } from '../../store/messageSlice/messageApiSlice';
import { IPropsCreateMessage } from './IPropsCreateMessage';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { IReplyData, TypingData } from '../../types/types';
import socket from '../../utils/testSocket';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import Headling from '../Headling/Headling';
import { FaFile, FaCircleStop, FaPencil, FaDeleteLeft, FaReply, FaCircleXmark } from "react-icons/fa6";
import { titleSlice } from '../../utils/textSlice';
import { clearReply } from '../../store/messageSlice/messageSlice';

const CreateMessageForm = ({ roomId }: IPropsCreateMessage) => {
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [createMessageQuery] = useCreateMessageMutation();
    const [ text, setText ] = useState<string>('');
    const [dataTyping, setDataTyping] = useState<TypingData>();
    const [isOpenEmoji, setIsOpenEmoji] = useState(false);
    const { user } = useSelector((state: RootState) => state.auth)
    const { theme } = useSelector((state: RootState) => state.modal);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [changeRecording, setChangeRecording] = useState<boolean>(false);
    const [recordedUrl, setRecordedUrl] = useState('');
    const mediaStream = useRef<MediaStream | null>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const chunks = useRef<BlobPart[]>([]);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [isClearAudio, setIsClearAudio] = useState<boolean>(false);
    const { replyMessageData } = useSelector((state: RootState) => state.messages);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (roomId && socket) {
            socket.emit('join-room', roomId);
        }
        socket.on('set-typing', (data: TypingData) => {
            setDataTyping(data);
        });

        return () => {
            socket.off("set-typing");
            socket.off('join-room');
            socket.emit('leave-room');
        }
    }, [socket, roomId]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            socket?.emit('typing', { roomId, isTyping: false, name: user && user.name });
        }, 1500);

        return () => clearTimeout(timeoutId);
    }, [text]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, style } = e.target;
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
        if (file) {
            setCurrentFile(file);
        }
        
        if (inputRef.current) {
            inputRef.current.focus();
        }
       
        if (file) {
            if (file.type.startsWith("image")) {
                const preview = URL.createObjectURL(file);
                setPreviewImage(preview);
            }
        }
    };

    const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();

            if (!currentFile && !text.trim() && !audioBlob) {
                toast.error('Сообщение не содержит текст и/или файл');
                return;
            }
            const formData = new FormData();
            if (roomId) formData.append('roomId', roomId);
            if (text) formData.append('text', text);

            if (audioBlob) {
                formData.append('content', audioBlob);
            } else if (currentFile) {
                formData.append('content', currentFile);
            }

            if (replyMessageData) {
                const replyData: IReplyData = {
                    senderId: replyMessageData?.senderId._id,
                    messageId: replyMessageData?._id,
                };
                formData.append('repliedMessage', JSON.stringify(replyData));
            }

            try {
                await createMessageQuery(formData).unwrap();
                setCurrentFile(null);
                setText('');
                setPreviewImage(null);
                setAudioBlob(null);
                dispatch(clearReply())

            } catch (error: any) {
                if (error && error.data) {
                    toast.error(error.data.message)
                } else {
                    toast.error("Ошибка сервера")
                }
            }
            
            e.currentTarget.style.height = 'auto';
        }
    };

    const emojiHandler = (smile: any) => {
        setText(text => text += smile.native);
    };

    const deletePreview = () => {
        if (previewImage)
            URL.revokeObjectURL(previewImage);

        setCurrentFile(null);
        setPreviewImage(null);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(
                { audio: true }
            );
            mediaStream.current = stream;
            mediaRecorder.current = new MediaRecorder(stream);
            
            mediaRecorder.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.current.push(e.data);
                }
            };

            mediaRecorder.current.onstop = () => {
                const recordedBlob = new Blob(chunks.current, { type: 'audio/mp3' });
                const url = URL.createObjectURL(recordedBlob);
                setAudioBlob(recordedBlob);
                setRecordedUrl(url);
                setIsClearAudio(false);
                chunks.current = [];
            };

            mediaRecorder.current.start();
            setChangeRecording(true);

        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const clearRecordingAudio = () => {
        setIsClearAudio(true);
        setCurrentFile(null);
        setAudioBlob(null);
    };

    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
          mediaRecorder.current.stop();
            setChangeRecording(false);
        }

        if (mediaStream.current) {
          mediaStream.current.getTracks().forEach((track) => {
            track.stop();
          });
        }
    };

    return (
        <>
            { replyMessageData && <div className={styles['reply-message']}>
                    <FaReply className={styles['reply-icon']} />
                    <div className={styles["reply-data"]}>
                        <span>В ответ: </span>
                        <span className={styles['reply-fullname']}>{replyMessageData.senderId.name}{' '}{replyMessageData.senderId.surname}</span>
                        <div>{
                            titleSlice(replyMessageData.text || '', 20) || 
                            titleSlice(replyMessageData.content?.filename || '', 20)}
                        </div>
                    </div>
                <span onClick={() => dispatch(clearReply())} className={styles['close-reply']}><FaCircleXmark/></span>
            </div> }
            
            <Form 
                onSubmit={(e) => e.preventDefault()} 
                className={styles.form} encType="multipart/form-data">
            
                { dataTyping && dataTyping.isTyping && <div className={styles.typing}> 
                    {dataTyping.name} печатает... <FaPencil /></div> 
                }

                { isOpenEmoji && (
                    <div className={styles.picker}>
                        <Picker
                            data={data}
                            theme={theme}
                            onEmojiSelect={(emoji: any) => emojiHandler(emoji)}
                            onClickOutside={() => setIsOpenEmoji(false)}
                        />
                    </div>
                )}
                { currentFile && (
                    <div className={styles["close-preview"]}>
                        <Headling element='h4'>Готово к отправке</Headling>
                        <AiFillCloseCircle className={styles['close']} onClick={deletePreview} />
                    </div>
                    )
                }

                {
                    previewImage && currentFile ? (
                        <div className={styles['preview-container']}>
                            <img className={styles['preview-image']} 
                                src={previewImage} 
                                alt="Preview"
                            />
                        </div>
                    )
                    : (
                        !previewImage && currentFile && (
                            <div className={styles['file-preview']}>
                                <FaFile />
                                <span>{currentFile.name}</span>
                            </div>
                        )
                    )
                }

                <div className={styles['form-controls']}>
                    <Button
                        color='transparent'
                        onMouseEnter={() => setIsOpenEmoji(true)}
                    >
                        <img className={styles.smile} src="../smiles.svg" alt="Smile" />
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
                        <Input 
                            id="createMessageFile"
                            name='createMessageFile'
                            onChange={sendFile}
                            icon={true}
                            className={styles.file}
                            type="file"
                        />
                    </div>

                    { audioBlob && !isClearAudio && (
                        <div className={styles['audio-container']}>
                            <audio className={styles['audio']} controls src={recordedUrl} />
                            <FaDeleteLeft onClick={clearRecordingAudio} className={styles.close} />
                        </div>
                    )}
                    
                    {
                        !changeRecording ? (
                            <Button
                                onClick={startRecording}
                                color='primary'>
                                <img className={styles.micro} src="../micro.svg" alt="записать голосовое"
                            />
                        </Button>
                        ) : (
                            <Button
                                onClick={stopRecording}
                                color='danger'>
                            <FaCircleStop />
                            </Button>
                        )
                    }
                </div>               
            </Form>
        </>
    );
};

export default CreateMessageForm;
