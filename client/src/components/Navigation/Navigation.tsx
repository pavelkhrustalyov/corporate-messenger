// import Avatar from '../Avatar/Avatar';
import { useState } from 'react';
import Profile from '../Profile/Profile';
import styles from './Navigation.module.css';
import { MdMenu } from "react-icons/md";
import Modal from '../Modal/Modal';
import Button from '../UI/Button/Button';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Avatar from '../Avatar/Avatar';

const Navigation = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { user } = useSelector((state: RootState) => state.auth)
    
    return (
        <div className={styles.navigation}>
            <Button className={styles['btn-more']} color="transparent" onClick={() => setIsOpen(true)}>
                <Avatar size="small" src={`http://localhost:8080/${user?.avatar}`} />
                <div className={styles['name']}>{user?.name} {user?.surname}</div>
            </Button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <Profile />
            </Modal>
        </div>
    ) 
}

export default Navigation;