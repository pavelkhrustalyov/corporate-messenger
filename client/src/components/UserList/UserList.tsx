import UserItem from '../UserItem/UserItem';
import styles from './UserList.module.css';
import cn from 'classnames';

const UserList = () => {
    return (
        <ul className={cn(styles['user-list'])}>
            <UserItem />
            <UserItem />
            <UserItem />
        </ul>
    );
}

export default UserList;