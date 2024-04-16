import { memo } from 'react';
import { IMessage } from '../../interfaces/IMessage';
import styles from './MessageItem.module.css';
import cn from 'classnames';
import Avatar from '../Avatar/Avatar';
import { BsCheck2All, BsCheck2 } from "react-icons/bs";

interface IMessageItemProps {
    message: IMessage,
    roomType: 'private' | 'group'
}

const MessageItem = ({ message, roomType }: IMessageItemProps) => {
    const date = new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(message.createdAt);

    return (
        <div className={cn(styles['message-item'], {
            [styles['my']]: message.my
        })}>
            {
                (roomType === 'private' && !message.my) && (
                    <Avatar 
                        className={styles.avatar}
                        size='small' 
                        src={message.senderId.avatar}
                    />
                )
            }
            <div
                className={cn(styles['message-data'])}>
                {
                    (roomType === 'private' && !message.my) && (
                        <div className={styles['user-data']}>
                            <div className={styles.name}>{message.senderId.name}</div>
                            <div className={styles.surname}>{message.senderId.surname}</div>
                        </div>
                    )
                }
                
                <div className={styles['message-content']}>{message.content}</div>
                <div className={styles.date}>
                    { message.my && (
                        <span className={styles.readed}>{ message.isRead ? 
                            <BsCheck2All className={styles['read-check']} /> : 
                            <BsCheck2 className={styles['read-uncheck']} /> }
                        </span>
                    )}
                    <span>{ date }</span>
                </div>
            </div>
        </div>
        
    )
};

export default memo(MessageItem);