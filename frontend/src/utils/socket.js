import { io } from 'socket.io-client';

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const SOCKET_URL = rawUrl.replace(/\/api$/, ''); 

const socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
});

export default socket;
