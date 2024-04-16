import styles from './RoomList.module.css';
import { rooms } from './Mock';
import RoomItem from '../RoomItem/RoomItem';

const RoomList = () => {
   
    return (
        <div className={styles['room-list']}>
            { !rooms.length && <div className={styles['room-empty']}>Диалогов нет</div> }
            { rooms.map(room => <RoomItem key={room._id} room={room}/>) }
        </div>
    )
};

export default RoomList;