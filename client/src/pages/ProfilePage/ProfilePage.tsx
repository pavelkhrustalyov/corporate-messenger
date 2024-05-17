import styles from './ProfilePage.module.css';
import Profile from '../../components/Profile/Profile';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import RoomData from '../../components/RoomData/RoomData';
import { FaPlus } from "react-icons/fa6";
import { closeSideInfo } from '../../store/modalSlice/modalSlice';

const ProfilePage = () => {
    const { room } = useSelector((state: RootState) => state.rooms);
    const { messages } = useSelector((state: RootState) => state.messages);
    const { user: currentUser } = useSelector((state: RootState) => state.auth);

    const interlocutor = room?.participants.find(p => p._id !== currentUser?._id);
    const dispatch = useDispatch<AppDispatch>();
    
    const files = messages
        .filter(message => message.messageType === 'file')
        .map(file => file.content?.filename);
    const images = messages
        .filter(message => message.messageType === 'image')
        .map(image => image.content?.filename);

    const propsData = { room, images, files, participants: room?.participants };

    return (
        <div className={styles['profile-page']}>
            <FaPlus onClick={() => dispatch(closeSideInfo())} className={styles.close} />
            { interlocutor && room?.type === 'private' && <Profile user={interlocutor} /> }
            { room && <RoomData {...propsData} /> }
        </div>
    )
}

export default ProfilePage;