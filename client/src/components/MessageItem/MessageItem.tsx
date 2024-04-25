import { memo, useEffect, useRef } from 'react';
import { IMessage } from '../../interfaces/IMessage';
import styles from './MessageItem.module.css';
import cn from 'classnames';
import Avatar from '../Avatar/Avatar';
import { BsCheck2All, BsCheck2 } from "react-icons/bs";
import { FaFile } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { convertBytes } from '../../utils/convertBytes';
import { getTime } from '../../utils/convertDate';

interface IMessageItemProps {
    message: IMessage,
    roomType: 'private' | 'group'
}

const MessageItem = ({ message, roomType }: IMessageItemProps) => {
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const downloadLink = document.getElementById('downloadLink');
        if (downloadLink) {
            downloadLink.addEventListener('click', function(event: any) {
                event.preventDefault();
                const link = event.currentTarget;
                const filePath = `/files/${message.content?.filename}`;
                link.href = filePath;
                window.open(filePath, '_blank');
            });
        }
    }, [])

    const isMyMessage = message.senderId._id === user?._id;

    return (
        <div className={cn(styles['message-item'], {
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
                        <img className={styles.image} src={`/message_images/${message.content?.filename}`} alt="Изображение сообщения" />
                    )
                }

                {
                  message.messageType === "file" && (
                    <a 
                        id="downloadLink"
                        href={`/files/${message.content?.filename}`}
                        download={`/files/${message.content?.filename}`}
                        className={styles.file}
                    >
                       <FaFile className={styles.icon} />
                       <span className={styles['file-text']}>
                            Файл: скачать
                       </span>
                       <div className={styles.size}>{convertBytes(Number(message.content?.size))}mb</div>
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
                <span>{ getTime(message.createdAt.toString()) }</span>
            </div>
        </div>
    )
};

export default memo(MessageItem);