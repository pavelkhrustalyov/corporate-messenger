import { memo } from 'react';
import { IMessage } from '../../interfaces/IMessage';
import MessageItem from '../MessageItem/MessageItem';
import styles from './MessageList.module.css';
import Loader from '../Loader/Loader';

const MessageList = ({ messages, isLoading }: { messages: IMessage[], isLoading: boolean}) => {
    return (
        <div className={styles['message-list']}>
             { isLoading ? <Loader className={styles.loader} /> :
                 messages.map(message => {
                    return (
                        <MessageItem
                            key={message._id}
                            message={message}
                            roomType="private"
                        />
                    );
                })
            }
        </div>
    )
};

export default memo(MessageList);