import { useDispatch, useSelector } from 'react-redux';
import styles from './AdminLayout.module.css';
import { AppDispatch, RootState } from '../../store/store';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { addUser } from '../../store/userSlice/userSlice';
import Headling from '../../components/Headling/Headling';
import socket from '../../utils/testSocket';
import { IUser } from '../../interfaces/IUser';
import AdminPage from '../../pages/AdminPage/AdminPage';
import { ToastContainer } from 'react-toastify';

const AdminLayout = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    if (user?.role !== 'admin') {
        return <Navigate to="/" replace />
    }

    useEffect(() => {
        socket.on("user-create", (user: IUser) => {
            dispatch(addUser(user));
        });

        return () => {
            socket.off("user-create");
        }
    }, [])

    return (
        <div className={styles.layout}>
            <ToastContainer />
            <Headling className={styles.heading} element='h1'>Панель администратора</Headling>
            <AdminPage />
        </div>
    );
};

export default AdminLayout;