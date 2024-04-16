import styles from './SelectRoomType.module.css';
import { MdMessage } from "react-icons/md";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { MdVideoChat } from "react-icons/md";

const SelectRoomType = () => {
    return (
        <div className={styles['room-type']}>
            <MdMessage className={styles['room-type__icon']}/>
            <MdOutlinePeopleAlt className={styles['room-type__icon']} />
            <MdVideoChat className={styles['room-type__icon']} />
        </div>
    );
}

export default SelectRoomType;