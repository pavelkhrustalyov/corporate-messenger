import styles from './EditUser.module.css';
import { positionsForSelect } from '../../../components/Auth/Register/utils';
import Modal from '../../../components/Modal/Modal';
import CustomSelect from '../../../components/UI/CustomSelect/CustomSelect';
import { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { getUserById, updatePosition } from '../../../store/userSlice/userSlice';
import { closeAdminEditProfile } from '../../../store/modalSlice/modalSlice';
import Button from '../../../components/UI/Button/Button';
import { Position } from '../../../types/types';
import { toast } from 'react-toastify';

const EditUser = () => {
    const [currentPosition, setCurrentPosition] = useState<Position>("Systems Analyst");
    const { isOpenAdminEditProfile, userIdForAdmin } = useSelector((state: RootState) => state.modal);
    const { user } = useSelector((state: RootState) => state.users);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (userIdForAdmin) {
            dispatch(getUserById(userIdForAdmin));
        }
    }, [userIdForAdmin]);

    const setPosition = (e: FormEvent) => {
        e.preventDefault();

        if (user) {
            dispatch(updatePosition({ userId: user?._id, position: currentPosition }));
            toast.success("Должность успешно установлена");
            dispatch(closeAdminEditProfile());
        }
    }

    

    return (
        <Modal isOpen={isOpenAdminEditProfile} onClose={() => dispatch(closeAdminEditProfile())}>
            <div className={styles.title}>Новая должность</div>
            <form onSubmit={setPosition} className={styles.data}>
                <CustomSelect defaultValue={currentPosition} selectHandler={setCurrentPosition} data={positionsForSelect} />
                <Button color="primary">Установить</Button>
            </form>
        </Modal>
    );
};

export default EditUser;