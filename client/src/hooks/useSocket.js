import { useEffect } from 'react';
import { io } from 'socket.io-client';
import useStore from '../store/useStore';

const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

export const useSocket = () => {
    const { setSocket, setRoom } = useStore();

    useEffect(() => {
        const socketInstance = io(SERVER_URL);

        socketInstance.on('connect', () => {
            console.log('Socket connected:', socketInstance.id);
        });

        socketInstance.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        socketInstance.on('room-update', (updatedRoom) => {
            console.log('4. [Frontend] Received room-update from server:', updatedRoom);
            setRoom(updatedRoom);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [setSocket, setRoom]);
};