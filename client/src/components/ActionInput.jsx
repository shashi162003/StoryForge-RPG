import React, { useState } from 'react';
import useStore from '../store/useStore';
import Spinner from './Spinner';

const WhisperIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.364.45.028.901.042 1.35.042a10.5 10.5 0 0010.5-10.5c0-.975-.139-1.908-.4-2.767l-2.432 2.432-1.35-1.35L9.25 7.5l-2.022 2.022-1.223 1.223a2.25 2.25 0 00-.635 1.591z" />
    </svg>
);

const ActionInput = ({ onActionSubmit, onWhisperSubmit }) => {
    const [actionText, setActionText] = useState('');
    const [isWhisper, setIsWhisper] = useState(false);
    const isSendingAction = useStore((state) => state.isSendingAction);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!actionText.trim()) return;

        if (isWhisper) {
            onWhisperSubmit(actionText);
        } else {
            onActionSubmit(actionText);
        }
        setActionText('');
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-background-light dark:bg-background-dark border-t-2 border-black">
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    value={actionText}
                    onChange={(e) => setActionText(e.target.value)}
                    placeholder="What do you do next?"
                    className="flex-grow px-4 py-3 text-xl bg-white dark:bg-gray-800 dark:text-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    disabled={isSendingAction}
                />
                <button
                    type="button"
                    onClick={() => setIsWhisper(!isWhisper)}
                    className={`p-3 text-xl font-bold border-2 border-black rounded-lg transition-all ${isWhisper
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'
                        }`}
                    title={isWhisper ? "Sending as a Whisper" : "Send Publicly"}
                    disabled={isSendingAction}
                >
                    <WhisperIcon />
                </button>
                <button
                    type="submit"
                    className="px-6 py-3 text-xl font-bold border-2 border-black rounded-lg shadow-[4px_4px_0px_#000] bg-primary text-white hover:bg-green-800 focus:outline-none transform hover:translate-y-1 hover:shadow-[2px_2px_0px_#000] transition-all"
                    disabled={isSendingAction}
                >
                    {isSendingAction ? <Spinner /> : 'Send'}
                </button>
            </div>
        </form>
    );
};

export default ActionInput;