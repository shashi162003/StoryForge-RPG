import React, { useEffect, useRef } from 'react';
import StoryEntry from './StoryEntry';

const StoryLog = ({ storyHistory = [] }) => {
    const endOfLogRef = useRef(null);

    useEffect(() => {
        endOfLogRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [storyHistory]);

    return (
        <div className="flex-grow p-4 overflow-y-auto flex flex-col">
            {storyHistory.map((entry, index) => (
                <StoryEntry key={index} entry={entry} />
            ))}
            <div ref={endOfLogRef} />
        </div>
    );
};

export default StoryLog;