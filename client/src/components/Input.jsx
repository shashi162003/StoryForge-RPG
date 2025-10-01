import React from 'react';

const Input = ({ ...props }) => {
    return (
        <input
            className="w-full px-4 py-3 text-2xl bg-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            {...props}
        />
    );
};

export default Input;