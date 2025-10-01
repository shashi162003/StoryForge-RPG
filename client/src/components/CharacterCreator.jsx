import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';

const CharacterCreator = ({ character, onCharacterSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onCharacterSave(name, description);
    };

    return (
        <div className="flex justify-center items-center h-full">
            <form onSubmit={handleSubmit} className="w-full max-w-lg p-8 bg-white dark:bg-gray-800 rounded-xl border-2 border-black shadow-[8px_8px_0px_#000] space-y-6">
                <h2 className="text-4xl font-bold text-center text-primary dark:text-secondary">Create Your Character</h2>

                <div className="text-center">
                    <p className="text-xl">The AI has granted you these starting attributes:</p>
                    <div className="flex justify-around mt-4 text-2xl font-bold">
                        <span>💪 Strength: {character.attributes.strength}</span>
                        <span>🧠 Wits: {character.attributes.wits}</span>
                        <span>🗣️ Charisma: {character.attributes.charisma}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <Input
                        placeholder="What is your character's name?"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Describe your character's appearance or background."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full h-24 px-4 py-3 text-xl bg-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        required
                    />
                </div>
                <Button type="submit">Begin Adventure</Button>
            </form>
        </div>
    );
};

export default CharacterCreator;