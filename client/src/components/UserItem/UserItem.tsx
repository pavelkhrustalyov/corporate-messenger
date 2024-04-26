import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import Avatar from '../Avatar/Avatar';
import Headling from '../Headling/Headling';
import Button from '../UI/Button/Button';
import styles from './UserItem.module.css';
import cn from 'classnames';
import { IUser } from '../../interfaces/IUser';
import { openProfileModal } from '../../store/modalSlice/modalSlice';
import { FaCirclePlus } from "react-icons/fa6";
import { AiFillCheckCircle } from "react-icons/ai";
import { useState } from 'react';

interface IPropsUserItem {
    user: IUser, 
    addUserToRoom?: (userId: string) => void
}

const UserItem = ({ user, addUserToRoom }: IPropsUserItem) => {
    const dispatch = useDispatch<AppDispatch>();
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const [ isAdded, setIsAdded ] = useState<boolean>(false);

    const addUserToRoomHandler = (userId: string) => {
        if (addUserToRoom) {
            setIsAdded((prev) => !prev);
            addUserToRoom(userId)
        }
    };

    return (
        <li className={cn(styles['user-item'])}>
            <div
                className={styles["user-data"]}
                onClick={() => dispatch(openProfileModal(user._id))}
            >
                <Avatar className={styles.avatar} size='small' src={`/avatars/${user.avatar}`} />
                <Headling 
                    className={styles.title}
                    element="h3">{user.name}&nbsp;{user.surname}
                </Headling>
                <span className={cn(styles.status, {
                    [styles['is-online']]: user.status === "Online"
                })}></span>
            </div>
            { addUserToRoom && currentUser?._id !== user._id &&
                <Button 
                    color='transparent' 
                    onClick={() => addUserToRoomHandler(user._id)}>
                    {
                        !isAdded ? <FaCirclePlus className={styles.add} />
                        : <AiFillCheckCircle className={styles.done} />
                    }
                </Button> }
        </li>
    ) 
};

export default UserItem;