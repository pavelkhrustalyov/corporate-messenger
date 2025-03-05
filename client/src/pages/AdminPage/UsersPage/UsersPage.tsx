import { useEffect, useMemo, useState } from 'react';
import styles from './UsersPage.module.css';
import { unverifyUser, getUsers, verifyUser, searchUsers } from '../../../store/userSlice/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import Button from '../../../components/UI/Button/Button';
import { toast } from 'react-toastify';
import { openAdminEditProfile } from '../../../store/modalSlice/modalSlice';

const UsersPage = ({ searchInput }: { searchInput: string }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { users } = useSelector((state: RootState) => state.users);
    const [sortedField, setSortedField] = useState<'position' | 'surname'>('position');

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

    const verifyUserHandler = (userId: string) => {
        dispatch(verifyUser(userId));
        toast.success("Верификация успешно установлена");
    }

    const unverifyUserHandler = (userId: string) => {
        dispatch(unverifyUser(userId));
        toast.success("Верификация успешно снята");
    };

    const toLower = (str: string) => str.toLowerCase();

    const searchedUsers = useMemo(() => {
        return users.filter(({ name, surname, patronymic, position, phone }) => {
            const fullname = toLower(`${name} ${surname} ${patronymic}`);
            const positionTransformed = toLower(position);
    
            return fullname.includes(searchInput) || 
                positionTransformed.includes(searchInput) || 
                phone.includes(searchInput);
        });
    }, [users, searchInput]);
    
    const sortedUsers = useMemo(() => {
        return [...searchedUsers].sort((a, b) => {
            if (a[sortedField] > b[sortedField]) return 1;
            else if (a[sortedField] < b[sortedField]) return -1;
            else return 0;
        });
    }, [searchedUsers, sortedField]);

    return (
        <table className={styles.table} border={1}>
            <thead>
                <tr>
                    <th className={styles['toucheble-th']} onClick={() => setSortedField('surname')}>ФИО &#8595;</th>
                    <th>Телефон</th>
                    <th className={styles['toucheble-th']} onClick={() => setSortedField('position')}>Должность &#8595;</th>
                    <th>Редактирование</th>
                    <th>Верификация</th>
                </tr>
            </thead>
            <tbody>
                {
                    sortedUsers.map(user => (
                        <tr key={user._id}>
                            <td>{user.surname} {user.name} {user.patronymic}</td>
                            <td>{user.phone}</td>
                            <td>{user.position}</td>
                            <td>
                                <Button 
                                    onClick={() => dispatch(openAdminEditProfile(user._id))} 
                                    color='success'>Сменить должность
                                </Button>
                            </td>
                            <td>
                                {
                                    !user.isVerified ? 
                                    <Button onClick={() => verifyUserHandler(user._id)} color='primary'>Верифицировать</Button> : 
                                    <Button 
                                        onClick={() => unverifyUserHandler(user._id)} 
                                        color='danger'>Верифицирован
                                    </Button>
                                }
                            </td>
                        </tr>
                    ))
                }
                
            </tbody>
        </table>
    );
};

export default UsersPage;