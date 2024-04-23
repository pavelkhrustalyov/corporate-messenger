import { memo, useEffect, useRef } from 'react';
import { IMessage } from '../../interfaces/IMessage';
import styles from './MessageItem.module.css';
import cn from 'classnames';
import Avatar from '../Avatar/Avatar';
import { BsCheck2All, BsCheck2 } from "react-icons/bs";
import { MdAttachFile } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface IMessageItemProps {
    message: IMessage,
    roomType: 'private' | 'group'
}

const MessageItem = ({ message, roomType }: IMessageItemProps) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const lastMessageRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (lastMessageRef.current) {
            const message = lastMessageRef.current as HTMLElement;
            message.scrollIntoView({ behavior: 'smooth', block: "end" })
        }
    }, [lastMessageRef]);

    useEffect(() => {
        const downloadLink = document.getElementById('downloadLink');
        if (downloadLink) {
            downloadLink.addEventListener('click', function(event: any) {
                event.preventDefault();
                const link = event.currentTarget;
                const filePath = `/files/${message.content}`;
                link.href = filePath;
                window.open(filePath, '_blank');
            });
        }
    }, [])

    const date = new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(message.createdAt));

    const isMyMessage = message.senderId._id === user?._id;

    return (
        <div ref={lastMessageRef} className={cn(styles['message-item'], {
            [styles['my']]: isMyMessage,
            [styles['type-image']]: message.messageType === 'image'
        })}>
            {
                (roomType === 'private' && !isMyMessage) && (
                    <Avatar 
                        className={styles.avatar}
                        size='small' 
                        src={`/avatars/${message.senderId.avatar}`}
                    />
                )
            }
            <div
                className={cn(styles['message-data'])}>
                {
                    (roomType === 'private' && !isMyMessage) && (
                        <div className={styles['user-data']}>
                            <div className={styles.name}>{message.senderId.name}</div>
                            <div className={styles.surname}>{message.senderId.surname}</div>
                        </div>
                    )
                }
                {
                    message.messageType === "image" && (
                        <img className={styles.image} src={`/message_images/${message.content}`} alt="Изображение сообщения" />
                    )
                }

                {
                  message.messageType === "file" && (
                    <a 
                        id="downloadLink"
                        href={`/files/${message.content}`}
                        download={`/files/${message.content}`}
                        className={styles.file}
                    >
                       <MdAttachFile className={styles.icon} /> Вложение 
                    </a>
                )
                }
                <div className={styles['message-text']}>{message.text}</div>

              
                </div>
                <div className={styles.date}>
                    { isMyMessage && (
                        <span className={styles.readed}>{ message.isRead ? 
                            <BsCheck2All className={styles['read-check']} /> : 
                            <BsCheck2 className={styles['read-uncheck']} /> }
                        </span>
                    )}
                <span>{ date }</span>
            </div>
        </div>
    )
};

export default memo(MessageItem);