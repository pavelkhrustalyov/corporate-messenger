import styles from './RoomList.module.css';
import { rooms } from './Mock';
import RoomItem from '../RoomItem/RoomItem';
import { useGetRoomsQuery } from '../../store/roomSLice/roomApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getRooms } from '../../store/roomSLice/roomSlice';
import { RootState } from '../../store/store';
import { useEffect } from 'react';
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
    const dispatch = useDispatch();

    useEffect(() => {
        if (roomData) {
            dispatch(getRooms(roomData))
        }
    }, [dispatch, roomData]);

    return (
        <div className={styles['room-list']}>
            { isLoading &&  <div>Loading...</div> }
            { isError && <div>Error...</div> }
            { !rooms.length && <div className={styles['room-empty']}>Диалогов нет</div> }
            { roomList.map(room => <RoomItem key={room._id} room={room}/>) }
        </div>
    )
};

export default RoomList;