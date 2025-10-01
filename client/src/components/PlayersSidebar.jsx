import React from 'react';

const PlayersSidebar = ({ players = [] }) => {
    return (
        <aside className="w-72 bg-secondary/30 dark:bg-primary/30 p-4 border-l-2 border-black">
            <h2 className="text-3xl font-bold mb-4 text-primary dark:text-secondary">Party ({players.length})</h2>
            <ul className="space-y-4">
                {players.map((player) => (
                    <li key={player.username} className="p-3 text-lg bg-white dark:bg-gray-800 border-2 border-black rounded-lg shadow-[4px_4px_0px_#000]">
                        <h3 className="text-xl font-bold">{player.characterName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Played by {player.username}</p>
                        <div className="mt-2 text-base flex justify-between">
                            <span>💪 {player.attributes.strength}</span>
                            <span>🧠 {player.attributes.wits}</span>
                            <span>🗣️ {player.attributes.charisma}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default PlayersSidebar;