import { useState } from 'react';
import Input from '../../components/UI/Input/Input';
import styles from './AdminPage.module.css';
import EditUser from './EditUser/EditUser';
import UsersPage from './UsersPage/UsersPage';

const AdminPage = () => {
    const [searchInput, setSearchInput] = useState<string>('');

    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    return (
        <div className={styles.admin}>
            <Input 
                onChange={onSearch} 
                value={searchInput} 
                className={styles.search} 
                type='search' 
                placeholder='Поиск пользователя'
            />
            <UsersPage searchInput={searchInput} />
            <EditUser />
        </div>
    );
};

export default AdminPage;