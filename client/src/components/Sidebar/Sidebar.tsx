import RoomList from '../RoomList/RoomList';
import styles from './Sidebar.module.css';

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            <RoomList />
        </div>
    );
};

export default Sidebar;