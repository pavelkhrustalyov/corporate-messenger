import { io } from 'socket.io-client';
const user = localStorage.getItem('user');

const BASE_URL = 'http://localhost:8080';
const socket = () => io(BASE_URL, {
    query: {
        userId: user ? JSON.parse(user) : null
    }
});

export default socket;
