import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useStore from '../store/useStore';
import Input from '../components/Input';
import Button from '../components/Button';
import { motion } from 'framer-motion';

const themes = [
    { name: 'High Fantasy', description: 'Classic swords and sorcery.' },
    { name: 'Cyberpunk Noir', description: 'Rain-slicked streets and neon-lit mysteries.' },
    { name: 'Cosmic Horror', description: 'Unspeakable dread from beyond the stars.' },
];

const LobbyPage = () => {
    const [username, setUsername] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [worldSeed, setWorldSeed] = useState('High Fantasy');
    const navigate = useNavigate();
    const { setUser, setRoom } = useStore();

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        if (!username.trim()) return alert('Please enter a username');

        try {
            const { data: { room: newRoom } } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/rooms`, { username, worldSeed },
                { withCredentials: true }
            );

            setUser({ username });
            setRoom(newRoom);
            navigate(`/room/${newRoom.roomCode}`);
        } catch (error) {
            console.error('Error creating room:', error);
            alert('Could not create room. Please try again.');
        }
    };

    const handleJoinRoom = async (e) => {
        e.preventDefault();
        if (!username.trim() || !roomCode.trim()) return alert('Please enter a username and room code');

        try {
            const upperCaseRoomCode = roomCode.toUpperCase();
            await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/rooms/${upperCaseRoomCode}`);

            setUser({ username });
            navigate(`/room/${upperCaseRoomCode}`);
        } catch (error) {
            console.error("Error joining room:", error);
            alert("Room not found or an error occurred. Please check the code and try again.");
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen p-4 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark overflow-hidden">
            <motion.div
                className="text-center mb-12"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-8xl font-bold text-primary">StoryForge</h1>
                <p className="text-2xl text-secondary">
                    Your collaborative storytelling adventure awaits.
                </p>
            </motion.div>

            <div className="w-full max-w-md">
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-2xl text-center text-primary dark:text-secondary mb-3">Choose Your Adventure's Theme</h2>
                    <div className="flex justify-center space-x-2 p-2 bg-white/50 dark:bg-black/20 border-2 border-black rounded-lg shadow-[4px_4px_0px_#000]">
                        {themes.map((theme) => (
                            <button
                                key={theme.name}
                                onClick={() => setWorldSeed(theme.name)}
                                className={`flex-1 p-2 text-xl rounded-md transition-all border-2 ${worldSeed === theme.name
                                        ? 'bg-accent text-white border-black transform scale-105'
                                        : 'bg-transparent border-transparent hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {theme.name}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <div className="w-full max-w-sm">
                    <motion.form
                        onSubmit={handleCreateRoom}
                        className="space-y-4"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Input
                            type="text"
                            placeholder="Enter your name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Button type="submit">Create Adventure</Button>
                    </motion.form>

                    <motion.form
                        onSubmit={handleJoinRoom}
                        className="space-y-4 mt-8"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Input
                            type="text"
                            placeholder="Enter room code"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value)}
                        />
                        <Button type="submit">Join Adventure</Button>
                    </motion.form>
                </div>
            </div>
        </div>
    );
};

export default LobbyPage;