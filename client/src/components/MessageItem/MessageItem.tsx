import { memo, useEffect, useRef, useState } from 'react';
import { IMessage } from '../../interfaces/IMessage';
import styles from './MessageItem.module.css';
import cn from 'classnames';
import Avatar from '../Avatar/Avatar';
import { BsCheck2All, BsCheck2 } from "react-icons/bs";
import { FaFile, FaReply } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { convertBytes } from '../../utils/convertBytes';
import { getTime } from '../../utils/convertDate';
import { openFullImage, openProfileModal } from '../../store/modalSlice/modalSlice';
import { deleteMessageHandler, setReply } from '../../store/messageSlice/messageSlice';

interface IMessageItemProps {
    message: IMessage,
    roomType: 'private' | 'group'
}

const MessageItem = ({ message, roomType }: IMessageItemProps) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [isAudioLoaded, setIsAudioLoaded] = useState(false);
    const [isOpenContextMenu, setIsOpenContextMenu] = useState(false);

    const downloadLinkRef = useRef<HTMLAnchorElement>(null);
    const handleImageLoad = () => {
        setIsImageLoaded(true);
    };

    const handleAudioLoad = () => {
        setIsAudioLoaded(true);
    };

    const openContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        setIsOpenContextMenu(prev => !prev);
    };

    useEffect(() => {
        const downloadLink = downloadLinkRef.current;
        if (downloadLink) {
            const handleDownload = (event: any) => {
                event.preventDefault();
                const filePath = `/files/${message.content?.filename}`;
                window.open(filePath, '_blank');
            };

            downloadLink.addEventListener('click', handleDownload);
            return () => {
                downloadLink.removeEventListener('click', handleDownload);
            };
        }
    }, [message.content]);

    const isMyMessage = message.senderId._id === user?._id;

    return (
        <div onContextMenu={openContextMenu} className={cn(styles['message-item'], {
            [styles['my']]: isMyMessage,
            [styles['type-image']]: message.messageType === 'image',
            [styles['type-voice']]: message.messageType === 'voice',
        })}>
            { isOpenContextMenu && <div className={styles.context}>
                <span onClick={() => dispatch(setReply(message))}>Ответить</span>
                
                {message?.senderId._id === user?._id && (
                    <span
                        onClick={() => dispatch(deleteMessageHandler({ 
                            senderId: message.senderId._id,
                            messageId: message._id 
                        }))}
                    >
                       Удалить
                    </span>
                )}
            </div> }
            {(roomType === 'group' && !isMyMessage) && (
                <Avatar 
                    isOnline={message.senderId.status === "Online"}
                    className={styles.avatar}
                    size='small'
                    src={`/avatars/${message.senderId.avatar}`}
                />
            )}

            <div className={cn(styles['message-data'])}>
                {(roomType === 'group' && !isMyMessage) && (
                    <div 
                        onClick={() => dispatch(openProfileModal(message.senderId._id))} 
                        className={styles['user-data']}
                    >
                        <div className={styles.name}>{message.senderId.name}</div>
                        <div className={styles.surname}>{message.senderId.surname}</div>
                    </div>
                )}

                {message.messageType === "image" && (
                    <div className={styles['image-wrapper']}>
                        <img
                            onClick={() => dispatch(openFullImage(`/message_images/${message.content?.filename}`))}
                            className={cn(styles.image, {
                                [styles['image-loaded']]: isImageLoaded,
                                [styles['image-placeholder']]: !isImageLoaded
                            })}
                            src={`/message_images/${message.content?.filename}`}
                            alt="Изображение сообщения"
                            onLoad={handleImageLoad}
                        />
                        {!isImageLoaded && (
                            <div className={styles['loading-overlay']}>
                                Загрузка...
                            </div>
                        )}
                    </div>
                )}

                {message.messageType === "file" && (
                    <a 
                        ref={downloadLinkRef}
                        href={`/files/${message.content?.filename}`}
                        download={`/files/${message.content?.filename}`}
                        className={styles.file}
                    >
                       <FaFile className={styles.icon} />
                       <span className={styles['file-text']}>
                            Приложенный файл
                       </span>
                       <div className={styles.size}>{convertBytes(Number(message.content?.size))}mb</div>
                    </a>
                )}

                {message.messageType === "voice" && (
                    <div className={styles['audio-wrapper']}>
                        <audio 
                            className={cn(styles['audio'], {
                                [styles['audio-loaded']]: isAudioLoaded
                            })}
                            controls 
                            src={`/voices/${message.content?.filename}`}
                            onCanPlay={handleAudioLoad}
                        />
                        {!isAudioLoaded && (
                            <div className={styles['loading-overlay']}>
                                Загрузка аудио...
                            </div>
                        )}
                    </div>
                )}
                { message.repliedMessage !== null && 
                    <span className={styles.reply}>
                        <div className={styles['reply-author']}>
                            <FaReply className={styles['reply-icon']} />
                            { `${message.repliedMessage?.senderId?.name} ${message.repliedMessage?.senderId?.surname}` }
                        </div>
                        
                        <div>{ message.repliedMessage.messageId?.text || '' }</div>

                        { message.repliedMessage.messageId?.messageType === "image" && 
                            <img className={styles['reply-image']} 
                            src={`/message_images/${message?.repliedMessage?.messageId?.content.filename}`}  /> 
                        }
                        { message.repliedMessage.messageId?.messageType === "file" &&  
                            <span className={styles['file-text']}>Приложенный файл </span>
                        }
                        { message.repliedMessage.messageId?.messageType === "voice" &&  
                            <span className={styles['file-text']}>Голосовое сообщение </span>
                        }
                    </span>
                }
               
                <div className={styles['message-text']}>{message.text}</div>
                <div className={styles.date}>
                    <span>{getTime(message.createdAt.toString())}</span>
                    
                    {isMyMessage && (
                        <span className={styles.readed}>
                            {message.isRead ? 
                                <BsCheck2All className={styles.readed} /> : 
                                <BsCheck2 className={styles.readed} />
                            }
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(MessageItem);