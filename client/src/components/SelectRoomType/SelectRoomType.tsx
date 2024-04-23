import styles from './SelectRoomType.module.css';
import Input from '../UI/Input/Input';

const SelectRoomType = () => {
    return (
        <div className={styles['room-type']}>
            <img className={styles.icon} src="search.svg" alt="Поиск" />
            <Input type="search" className={styles['search__input']} placeholder='Поиск сообщений' />
        </div>
    );
}

export default SelectRoomType;