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
import { AiFillCheckCircle, AiFillDelete } from "react-icons/ai";
import { IRoom } from '../../interfaces/IRoom';

interface IPropsUserItem {
    user: IUser, 
    addUserToRoom?: (userId: string) => void;
    userIds?: string[];
    deleteUser?: (userId: string) => void;
    room?: IRoom;
}

const UserItem = ({ user, addUserToRoom, userIds, deleteUser, room }: IPropsUserItem) => {
    const dispatch = useDispatch<AppDispatch>();
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const addUserToRoomHandler = (userId: string) => {
        if (addUserToRoom) {
            addUserToRoom(userId)
        }
    };

    return (
        <li className={cn(styles['user-item'])}>
            <div
                className={styles["user-data"]}
                onClick={() => dispatch(openProfileModal(user._id))}
            >
                <Avatar className={styles.avatar} size='middle' src={`/avatars/${user.avatar}`} />
                <Headling
                    className={styles.title}
                element="h3">
                    {user.name}&nbsp;{user.surname}
                </Headling>
                { user._id === room?.creator?._id && <span className={styles.admin}>(Админ)&nbsp;</span> }
                <span className={cn(styles.status, {
                    [styles['is-online']]: user.status === "Online"
                })}></span>
            </div>
            {
                addUserToRoom && currentUser?._id !== user._id &&
                    <Button
                        color='transparent' 
                        onClick={() => addUserToRoomHandler(user._id)}>
                        {
                            userIds && !userIds.includes(user._id) ? <FaCirclePlus className={styles.add} />
                            : <AiFillCheckCircle className={styles.done} />
                        }
                    </Button>
            }
            {
                deleteUser && currentUser?._id !== user._id && 
                currentUser?._id === room?.creator?._id &&
                room?.type === 'group' &&
                <Button
                    className={styles.delete}
                    color='transparent'
                    onClick={() => deleteUser(user._id)}>
                    <AiFillDelete />
                </Button>
            }
        </li>
    ) 
};

export default UserItem;