import { useEffect, useState } from 'react';
import Input from '../UI/Input/Input';
import UserItem from '../UserItem/UserItem';
import styles from './UserList.module.css';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { searchUsers } from '../../store/userSlice/userSlice';

interface IProps {
    deleteUser?: (userId: string) => void;
    userIds?: string[];
    addUserToRoom?: (userId: string) => void;
}

const UserList = ({ addUserToRoom, userIds, deleteUser }: IProps) => {

    const [search, setSearch] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { users } = useSelector((state: RootState) => state.users);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search.trim()) {
                dispatch(searchUsers(search));
            } else {
                dispatch(searchUsers("\"\""));
            }
        }, 1000);

        return () => {
            clearTimeout(timeout);
        }
        
    }, [search, dispatch]);

    return (
        <div className={cn(styles['user-data'])}>
            {/* <Headling className={styles.heading} element="h3">Поиск пользователей</Headling> */}
            <Input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className={styles.search} 
                type='search' 
                placeholder='Найти...'
            />
            
            <ul className={cn(styles['user-list'])}>
                { users && users.map(user => <UserItem deleteUser={deleteUser} userIds={userIds} addUserToRoom={addUserToRoom} key={user._id} user={user} />) }
            </ul>
        </div>
    );
}

export default UserList;