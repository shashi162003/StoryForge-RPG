import React from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeSwitcher = () => {
    const [theme, setTheme] = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 border-2 border-black rounded-lg text-2xl"
        >
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
};

export default ThemeSwitcher;