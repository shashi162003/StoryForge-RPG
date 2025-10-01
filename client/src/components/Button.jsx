import React from 'react';

const Button = ({ children, ...props }) => {
    return (
        <button
            className="w-full px-4 py-3 text-2xl font-bold border-2 border-black rounded-lg shadow-[4px_4px_0px_#000] bg-accent text-white hover:bg-yellow-600 focus:outline-none transform hover:translate-y-1 hover:shadow-[2px_2px_0px_#000] transition-all"
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;