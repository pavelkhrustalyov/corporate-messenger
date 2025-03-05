import { useState } from 'react';
import { IUser } from '../../interfaces/IUser';
import styles from './RoomData.module.css';
import cn from 'classnames';
import Headling from '../Headling/Headling';
import UserItem from '../UserItem/UserItem';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { kickOutOfGroup } from '../../store/roomSlice/roomSlice';
import { IRoom } from '../../interfaces/IRoom';
import Avatar from '../Avatar/Avatar';
import { FaFileImage, FaFileArrowDown } from "react-icons/fa6";
import { titleSlice } from '../../utils/textSlice';
import { openFullImage } from '../../store/modalSlice/modalSlice';
import UpdateImageGroup from '../UpdateImageGroup/UpdateImageGroup';

interface IPropsRoomData {
    files?: (string[] | undefined)[];
    images?: (string[] | undefined)[];
    participants: IUser[];
    room: IRoom;
}

const RoomData = ({ files, images, participants, room }: IPropsRoomData) => {
    const [activeTab, setActiveTab] = useState<string>('all');
    const dispatch = useDispatch<AppDispatch>();
    const [userIds, _] = useState<string[]>([]);
    const { user } = useSelector((state: RootState) => state.auth);
    
    const tabs = [
        { name: 'images', title: 'Изображений', data: images, icon: <FaFileImage/> },
        { name: 'files', title: 'Файлов', data: files, icon: <FaFileArrowDown/> },
    ];

    const filteredTabs = tabs.filter(tab => {
        if (activeTab === 'all') return false;
        return tab.name === activeTab;
    });

    const deleteUser = (userId: string) => {
        const user = participants.find(user => user._id === userId);

        const confirm = window.confirm(`Вы хотите удалить ${user?.name} ${user?.surname}`);
        if (confirm) {
            dispatch(kickOutOfGroup({ userId, roomId: room._id }));
        }
    };


    return (
        <div className={styles['room-data']}>
            <Headling className={styles.heading} element='h3'>Информация о чате:</Headling>
            {
                room.type === "group" || room?.type === 'video' && (
                    <div className={styles["room-data-head"]}>
                        {
                            room.creator?._id !== user?._id ? 
                            <Avatar src={`/group_avatars/${room.imageGroup}`} size='large'/>
                            : <UpdateImageGroup room={room} />
                        }
                        
                        <div className={styles.title}>
                            <Headling element='h3'>{titleSlice(room.title || '', 15)}</Headling>

                            <span className={styles.subtitle}>Участники: </span>
                            <span className={styles.subtitle}>{room.participants.length}</span>
                        </div>
                    </div>
                )
            }
            
            <div className={styles.controls}>
                {
                    tabs.map(tab => (
                        <div
                            key={tab.name}
                            className={styles.control}
                            onClick={() => setActiveTab(tab.name)} 
                            >
                            <div className={styles["control-icon"]}>{tab.icon}</div>
                            <div className={styles["control-text"]}>{tab.title}: { tab.data && tab.data.length }</div>
                        </div>
                    ))
                }
            </div>

            {
                filteredTabs.map(tab => {
                    return (
                        <div key={tab.name} className={cn(styles.tabs, {
                            [styles.images]: tab.name === 'images',
                            [styles.files]: tab.name === 'files',
                        })}>
                            {
                                tab.data && tab.data.map((filename) => {
                                    if (!filename) return;
                                    return (
                                        <div key={filename} className={cn(styles.tab, {
                                            [styles.images]: tab.name === 'images',
                                            [styles.files]: tab.name === 'files',
                                        })}>
                                            { tab.name === 'images' ? 
                                                <img
                                                    onClick={() => dispatch(openFullImage(`/message_images/${filename}`))} 
                                                    src={`/message_images/${filename}`} /> :
                                                <span>File: {filename}</span>
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }

            {
                <ul className={styles.users}>
                    <Headling className={styles['participants-heading']} element='h4'>Участники: </Headling>
                    {
                        participants?.map(user => (
                            <UserItem 
                                room={room}
                                userIds={userIds}
                                deleteUser={deleteUser}
                                key={user._id}
                                user={user}
                            />
                        ))
                    }
                </ul>
            }
        </div>
    );
};

export default RoomData;

