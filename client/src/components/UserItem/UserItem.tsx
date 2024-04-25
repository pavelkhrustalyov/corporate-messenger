import styles from './UserItem.module.css';
import cn from 'classnames';

const UserItem = () => {
    return <li className={cn(styles['user-item'])}>UserItem</li>
};

export default UserItem;