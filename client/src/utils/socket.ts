import io from 'socket.io-client';

const BASE_URL = 'http://localhost:8080';
const createSocket = () => io(BASE_URL);

export default createSocket;
