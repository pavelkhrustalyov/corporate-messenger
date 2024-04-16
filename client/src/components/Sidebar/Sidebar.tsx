import RoomList from '../RoomList/RoomList';
import SelectRoomType from '../SelectRoomType/SelectRoomType';
import styles from './Sidebar.module.css';

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            <SelectRoomType />
            <RoomList />
        </div>
    );
};

export default Sidebar;