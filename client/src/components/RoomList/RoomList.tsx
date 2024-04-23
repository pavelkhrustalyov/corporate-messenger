import styles from './RoomList.module.css';
import RoomItem from '../RoomItem/RoomItem';
import { useGetRoomsQuery } from '../../store/roomSlice/roomApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getRooms } from '../../store/roomSlice/roomSlice';
import { RootState } from '../../store/store';
import { useEffect, useState } from 'react';
import Headling from '../Headling/Headling';
import cn from 'classnames';
import Loader from '../Loader/Loader';
// import io, { Socket } from 'socket.io-client';
// import createSocket from '../../utils/socket';

const RoomList = () => {

    // const [socket, setSocket] = useState<Socket | null>(null);

    // useEffect(() => {
    //     const newSocket = createSocket();
    //     setSocket(newSocket);

    //     newSocket.on('room-message', (message) => {
    //         console.log(message)
    //     })

    //     return () => {
    //         newSocket.disconnect();
    //     };
    // }, []);

    const { data: roomData, isLoading, isError } = useGetRoomsQuery();
    const { roomList } = useSelector((state: RootState) => state.rooms);
    const [currentTab, setCurrentTab] = useState<string>("");
    const dispatch = useDispatch();

    const tabs = [
        { name: "", text: "Все" },
        { name: "group", text: "Приватные" },
        { name: "private", text: "Общие" }
    ]

    useEffect(() => {
        if (roomData) {
            dispatch(getRooms(roomData))
        }
    }, [dispatch, roomData]);

    const filteredRooms = roomList.filter(room => room.type !== currentTab);

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
                            key={tab.name}>{tab.text}
                        </div> 
                    ))}
                </div>
            </div>

            { isLoading && <Loader className={styles.loader}/> }
            { isError && <div>Error...</div> }
            { !roomList.length && !isLoading && <div className={styles['room-empty']}>Диалогов нет</div> }
            { filteredRooms.map(room => <RoomItem key={room._id} room={room}/>) }
        </div>
    )
};

export default RoomList;