import styles from './RoomList.module.css';
import RoomItem from '../RoomItem/RoomItem';
import { useDispatch, useSelector } from 'react-redux';
import { addRoom, getRooms, updateRoom } from '../../store/roomSlice/roomSlice';
import { AppDispatch, RootState } from '../../store/store';
import { useEffect, useState } from 'react';
import Headling from '../Headling/Headling';
import cn from 'classnames';
import Loader from '../Loader/Loader';
import socket from '../../utils/testSocket';
import { IRoom } from '../../interfaces/IRoom';
// import io, { Socket } from 'socket.io-client';
// import createSocket from '../../utils/socket';
import { MdArchive, MdGroups, MdMailLock, MdListAlt } from "react-icons/md";

const RoomList = () => {
    const { roomList, isLoading, isError } = useSelector((state: RootState) => state.rooms);
    const [currentTab, setCurrentTab] = useState<string>("all");
    const dispatch = useDispatch<AppDispatch>();
    const [addedRooms, setAddedRooms] = useState<string[]>([]);
    const { user: currentUser } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(getRooms());
    }, []);

    useEffect(() => {
        socket.on("create-room", (room: IRoom) => {
            if (!addedRooms.includes(room._id)) {
                const userExist = room.participants.find(user => user._id === currentUser?._id);
                if (userExist) {
                    dispatch(addRoom(room));
                    setAddedRooms((prev) => [...prev, room._id])
                }
            }
        });
        socket.on("update-room", ({ room }: { room: IRoom }) => {
            dispatch(updateRoom(room));
        });

        return () => {
            socket.off("create-room");
            socket.off("update-room");
        }
    }, []);


    const tabs = [
        { name: "all", text: "Все", icon: <MdListAlt/>},
        { name: "private", text: "Приватные", icon: <MdMailLock/> },
        { name: "group", text: "Общие", icon: <MdGroups/> },
        { name: "archive", text: "Архив", icon: <MdArchive/> }
    ]

    const filteredRooms = roomList.filter(room => {
        if (currentTab === "all") {
            return !room.archived;
        }
        if (currentTab === "archive") {
            return room.archived;
        }

        if (currentTab === 'private' && room.archived) {
            return false;
        }
        if (currentTab === 'group' && room.archived) {
            return false;
        }

        return room.type === currentTab;
    });

    return (
        <div className={styles['room-list']}>
            <div className={styles['room-list__utils']}>
                <Headling className={styles.heading} element='h1'>Чаты</Headling>
                <div className={styles.tabs}>
                    { tabs.map(tab => (
                        <div className={cn(styles.tab, {
                            [styles.active]: tab.name === currentTab
                        })} 
                            onClick={() => setCurrentTab(tab.name)} 
                            key={tab.name}>{tab.icon}
                        </div> 
                    ))}
                </div>
            </div>

            { isLoading && !roomList.length && <Loader className={styles.loader}/> }
            { isError && <div>Error...</div> }
            { !roomList.length && !isLoading && <div className={styles['room-empty']}>Диалогов нет</div> }
            { filteredRooms.map(room => <RoomItem key={room._id} room={room}/>) }
        </div>
    )
};

export default RoomList;