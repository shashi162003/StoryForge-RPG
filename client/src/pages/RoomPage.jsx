import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useStore from '../store/useStore';
import RoomHeader from '../components/RoomHeader';
import PlayersSidebar from '../components/PlayersSidebar';
import StoryLog from '../components/StoryLog';
import ActionInput from '../components/ActionInput';
import CharacterCreator from '../components/CharacterCreator';
import PrivateMessage from '../components/PrivateMessage';
import { motion } from 'framer-motion';
import { useState } from 'react';

const RoomPage = () => {
    const { roomCode } = useParams();
    const { socket, user, room } = useStore();
    const [privateMessage, setPrivateMessage] = useState(null);

    useEffect(() => {
        if (socket) {
            const handlePrivateUpdate = (message) => {
                setPrivateMessage(message);
                setTimeout(() => {
                    setPrivateMessage(null);
                }, 8000);
            };

            socket.on('private-update', handlePrivateUpdate);

            return () => {
                socket.off('private-update', handlePrivateUpdate);
            };
        }
    }, [socket]);

    useEffect(() => {
        if (socket && user) {
            socket.emit('join-room', { roomCode, username: user.username });
        }
    }, [socket, user, roomCode]);

    const handleActionSubmit = (actionText) => {
        if (socket && user && room) {
            const payload = {
                roomCode: room.roomCode,
                username: user.username,
                actionText: actionText,
            };

            console.log('1. [Frontend] Sending action to server:', payload);

            socket.emit('send-action', payload);
        }
    };

    const handleWhisperSubmit = (actionText) => {
        if (socket && user && room) {
            socket.emit('send-whisper', {
                roomCode: room.roomCode,
                username: user.username,
                actionText: actionText,
            });
        }
    };

    const handleCharacterSave = (characterName, description) => {
        if (socket && user && room) {
            socket.emit('update-character', {
                roomCode: room.roomCode,
                username: user.username,
                characterName,
                description,
            });
        }
    };

    if (!room) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-background-light">
                <h1 className="text-4xl text-primary">Joining room...</h1>
            </div>
        );
    }

    const myCharacter = room.players.find(p => p.username === user.username);

    const needsCharacterCreation = myCharacter && myCharacter.characterName === `Adventurer ${user.username}`;

    return (
        <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
            <RoomHeader roomCode={room.roomCode} />
            <div className="flex flex-grow overflow-hidden">
                <main className="flex-grow flex flex-col">
                    {needsCharacterCreation ? (
                        <CharacterCreator character={myCharacter} onCharacterSave={handleCharacterSave} />
                    ) : (
                        <>
                            <StoryLog storyHistory={room.storyHistory} />
                            <ActionInput onActionSubmit={handleActionSubmit} 
                                    onWhisperSubmit={handleWhisperSubmit}/>
                        </>
                    )}
                </main>
                <PlayersSidebar players={room.players} />
            </div>
            <PrivateMessage message={privateMessage} />
        </div>
    );
};

export default RoomPage;