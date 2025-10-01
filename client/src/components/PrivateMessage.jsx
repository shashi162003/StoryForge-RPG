import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PrivateMessage = ({ message }) => {
    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-2xl p-4 bg-purple-100 dark:bg-purple-900 border-2 border-purple-500 rounded-lg shadow-lg"
                >
                    <p><span className="font-bold text-purple-600">{message.author}:</span> {message.content}</p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PrivateMessage;