import { io } from 'socket.io-client';
const BASE_URL = "http://localhost:8080";

const userString = localStorage.getItem('user');
const user = userString ? JSON.parse(userString) : {};

const socket = io(BASE_URL, {
    forceNew: true,
    reconnectionAttempts: Infinity,
    timeout: 5000,
    transports: ["websocket"],
    query: {
        userId: user._id,
    }
});
export default socket;