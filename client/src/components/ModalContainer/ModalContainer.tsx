import styles from './ModalContainer.module.css';
import CreateRoom from '../CreatePrivateRoom/CreateRoom';

import {
    closeGroupChatModal,
    closeProfileModal,
    closeSettingsModal,
    closePrivateChatModal,
    closeVideoChatModal
} from '../../store/modalSlice/modalSlice';

import { closeFullImage } from '../../store/modalSlice/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import Profile from '../Profile/Profile';
import Modal from '../Modal/Modal';
import EditProfile from '../EditProfile/EditProfile';
import SettingsPage from '../../pages/SettingsPage/SettingsPage';

const ModalContainer = () => {
    const {
        isOpenProfile, 
        isOpenGroupChat,
        isOpenSettings,
        isOpenPrivateChat,
        isOpenVideoChat,
        isOpenEditProfile,
        profile,
        isOpenFullImage,
        fullImage
    } = useSelector((state: RootState) => state.modal);

    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className={styles['modal-container']}>
            <Modal 
                className={styles['profile-modal']} 
                isOpen={isOpenProfile} onClose={() => dispatch(closeProfileModal())}>
                {
                    isOpenEditProfile ? <EditProfile /> : profile && <Profile user={profile} />
                }
            </Modal>

            <Modal isOpen={isOpenGroupChat}
                onClose={() => dispatch(closeGroupChatModal())}>
                <CreateRoom typeRoom='group'/>
            </Modal>

            <Modal isOpen={isOpenPrivateChat} 
                onClose={() => dispatch(closePrivateChatModal())}>
                <CreateRoom typeRoom='private'/>
            </Modal>

            <Modal isOpen={isOpenVideoChat} 
                onClose={() => dispatch(closeVideoChatModal())}>
                <CreateRoom typeRoom='video'/>
            </Modal>

            <Modal isOpen={isOpenSettings} 
                onClose={() => dispatch(closeSettingsModal())}>
                <SettingsPage />
            </Modal>

            <Modal isOpen={isOpenFullImage} 
                onClose={() => dispatch(closeFullImage())}>
                { fullImage && <img src={fullImage} /> }
            </Modal>
        </div>
    )
};

export default ModalContainer;