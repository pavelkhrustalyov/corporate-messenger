import { HtmlHTMLAttributes, forwardRef, memo } from 'react';
import { IMessage } from '../../interfaces/IMessage';
import MessageItem from '../MessageItem/MessageItem';
import styles from './MessageList.module.css';
import Loader from '../Loader/Loader';

interface IPropsMessageList {
    messages: IMessage[], isLoading: boolean
}

const MessageList = forwardRef<HTMLDivElement, IPropsMessageList>(({ messages, isLoading }, ref) => {
    return (
        <div ref={ref} className={styles['message-list']}>
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
});

export default memo(MessageList);