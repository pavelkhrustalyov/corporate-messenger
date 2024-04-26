import { forwardRef, memo } from 'react';
import { IMessage } from '../../interfaces/IMessage';
import MessageItem from '../MessageItem/MessageItem';
import styles from './MessageList.module.css';
import Loader from '../Loader/Loader';
import { IRoom } from '../../interfaces/IRoom';

interface IPropsMessageList {
    messages: IMessage[]; 
    isLoading: boolean;
    room: IRoom | null;
}

const MessageList = forwardRef<HTMLDivElement, IPropsMessageList>(({ messages, isLoading, room }, ref) => {

    if (!room) {
        return <div>404 not found</div>
    }

    return (
        <div ref={ref} className={styles['message-list']}>
             { isLoading ? <Loader className={styles.loader} /> :
                 messages.map(message => {
                    return (
                        <MessageItem
                            key={message._id}
                            message={message}
                            roomType={room?.type}
                        />
                    );
                })
            }
        </div>
    )
});

export default memo(MessageList);