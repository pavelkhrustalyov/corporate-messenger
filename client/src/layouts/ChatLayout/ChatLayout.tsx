import { Outlet } from 'react-router-dom'; 
import styles from './ChatLayout.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navigation from '../../components/Navigation/Navigation';

const ChatLayout = () => {
    return (
        <div className={styles['chat-layout']}>
            <Navigation />
            <Sidebar />
            <Outlet />
        </div>
    );
}

export default ChatLayout;