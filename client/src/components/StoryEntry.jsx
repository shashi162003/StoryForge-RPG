// client/src/components/StoryEntry.jsx
import React from 'react';
import { motion } from 'framer-motion';

const StoryEntry = ({ entry }) => {
    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const content = () => {
        switch (entry.type) {
            case 'IMAGE':
                return (
                    <div className="my-4 flex justify-center">
                        <img
                            src={entry.content}
                            alt="AI generated scene"
                            className="rounded-lg border-2 border-black shadow-[8px_8px_0px_#000]"
                        />
                    </div>
                );
            case 'SYSTEM':
                return (
                    <div className="text-center my-3">
                        <p className="text-lg text-gray-500 dark:text-gray-400 italic px-4 py-1 bg-gray-200 dark:bg-gray-700 rounded-full inline-block">
                            {entry.content}
                        </p>
                    </div>
                );
            case 'ACTION':
                return (
                    <div className="my-4">
                        <p className="text-2xl dark:text-gray-200">
                            <span className="font-bold text-accent mr-2">{entry.author}</span>
                            {entry.content}
                        </p>
                    </div>
                );
            case 'NARRATION':
                return (
                    <div className="my-4 p-4 bg-white/50 dark:bg-background-dark/50 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg">
                        <p className="text-2xl text-text-light dark:text-text-dark leading-relaxed">{entry.content}</p>
                    </div>
                );
            default:
                return null;
        }
    }
    return (
        <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
        >
            {content()}
        </motion.div>
    );
};

export default StoryEntry;