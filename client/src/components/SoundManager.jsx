import React, { useState, useRef, useEffect } from 'react';
import ambienceSound from '../assets/sounds/bgmusic.mp3';

const SoundManager = () => {
    const [isMuted, setIsMuted] = useState(true);
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
            audioRef.current.play().catch(e => console.log("Audio autoplay blocked."));
        }
    }, [isMuted]);

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    return (
        <div>
            <audio ref={audioRef} src={ambienceSound} loop />
            <button onClick={toggleMute} className="p-2 border-2 border-black rounded-lg text-2xl">
                {isMuted ? '🔇' : '🔊'}
            </button>
        </div>
    );
};

export default SoundManager;