import { useState } from 'react';
import { IUser } from '../../interfaces/IUser';
import Button from '../UI/Button/Button';
import styles from './RoomData.module.css';
import cn from 'classnames';
import Headling from '../Headling/Headling';
import UserItem from '../UserItem/UserItem';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { kickOutOfGroup } from '../../store/roomSlice/roomSlice';
import { IRoom } from '../../interfaces/IRoom';

interface IPropsRoomData {
    files?: (string[] | undefined)[];
    images?: (string[] | undefined)[];
    participants: IUser[];
    room: IRoom;
}

const RoomData = ({ files, images, participants, room }: IPropsRoomData) => {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [showUsers, setShowUsers] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const [userIds, _] = useState<string[]>([]);
    
    const tabs = [
        { name: 'images', title: 'Изображения', data: images },
        { name: 'files', title: 'Файлы', data: files },
    ];

    const filteredTabs = tabs.filter(tab => {
        if (activeTab === 'all') return false;
        return tab.name === activeTab;
    })

    const deleteUser = (userId: string) => {
        const user = participants.find(user => user._id === userId);

        const confirm = window.confirm(`Вы хотите удалить ${user?.name} ${user?.name}`);
        if (confirm)
            dispatch(kickOutOfGroup({ userId, roomId: room._id }))
    };

    return (
        <div className={styles['room-data']}>
            <Headling className={styles.heading} element='h2'>Данные о чате</Headling>

            <div className={styles.controls}>
                {
                    tabs.map(tab => (
                        <Button
                            key={tab.name}
                            disabled={tab.data && tab.data.length === 0} 
                            onClick={() => setActiveTab(tab.name)} 
                            color='primary'>
                                {tab.title}
                        </Button>
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
                                                <img src={`/message_images/${filename}`} /> :
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

            <Button
                onClick={() => setShowUsers(prev => !prev)} 
                color='primary'>
                    Участники чата
            </Button>
            {
                showUsers && 
                    <ul className={styles.users}>
                        {
                            participants?.map(user => (
                                <UserItem room={room} userIds={userIds} deleteUser={deleteUser} key={user._id} user={user} />
                            ))
                        }
                    </ul>
            }
        </div>
    );
};

export default RoomData;