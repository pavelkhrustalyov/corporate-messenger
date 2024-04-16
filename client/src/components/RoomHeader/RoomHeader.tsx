import { useState } from 'react';
import Modal from '../Modal/Modal';
import styles from './RoomHeader.module.css';
import { MdMoreHoriz } from "react-icons/md";
import Button from '../UI/Button/Button';

const RoomHeader = ({ roomId }: { roomId?: string }) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className={styles['room-header']}>
            <div className={styles.title}>Имя или название канала - {roomId}</div>

            <Button className={styles['more-btn']} color="transparent" onClick={() => setIsOpen(true)} >
                <MdMoreHoriz className={styles.more}/>
            </Button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                данные о комнате
            </Modal>
        </div>
    )
}

export default RoomHeader;