import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen p-4 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
            <div className="text-center mb-12">
                <h1 className="text-8xl font-bold text-primary">StoryForge</h1>
                <p className="text-2xl text-secondary">
                    Welcome to the adventure!
                </p>
            </div>
            <div className="w-full max-w-sm">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;