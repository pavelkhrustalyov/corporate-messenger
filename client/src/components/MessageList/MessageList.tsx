import { memo } from 'react';
import { IMessage } from '../../interfaces/IMessage';
import MessageItem from '../MessageItem/MessageItem';
import styles from './MessageList.module.css';

const MessageList = ({ messages }: { messages: IMessage[]}) => {
    return (
        <div className={styles['message-list']}>
             { messages.map(message => {
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