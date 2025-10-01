import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import SoundManager from './SoundManager';

const RoomHeader = ({ roomCode }) => {
    const handleLeave = () => {
        window.location.href = '/';
    };

    return (
        <header className="p-4 bg-background-light dark:bg-background-dark border-b-2 border-black flex justify-between items-center">
            <div>
                <h1 className="text-4xl font-bold text-primary">StoryForge</h1>
                <p className="text-lg text-secondary">
                    Room Code: <span className="font-mono bg-white dark:bg-gray-700 px-2 py-1 border-2 border-black rounded">{roomCode}</span>
                </p>
            </div>
            <div className="flex items-center space-x-4">
                <SoundManager />
                <ThemeSwitcher />
                <button
                    onClick={handleLeave}
                    className="px-4 py-2 text-xl font-bold border-2 border-black rounded-lg shadow-[4px_4px_0px_#000] bg-red-500 text-white hover:bg-red-600 focus:outline-none transform hover:translate-y-1 hover:shadow-[2px_2px_0px_#000] transition-all"
                >
                    Leave
                </button>
            </div>
        </header>
    );
};

export default RoomHeader;