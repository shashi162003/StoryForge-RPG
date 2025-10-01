import Room from '../models/Room.js';
import colors from 'colors';

const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// @desc Create a new room
// @route POST /api/rooms
// @access Public

export const createRoom = async (req, res) => {
    try {
        const { username, worldSeed } = req.body;
        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        const creatorCharacter = {
            username: username,
            characterName: `Adventurer ${username}`,
            description: 'The one who started it all.',
            attributes: {
                strength: Math.floor(Math.random() * 6) + 8,
                wits: Math.floor(Math.random() * 6) + 8,
                charisma: Math.floor(Math.random() * 6) + 8,
            }
        };

        const newRoom = new Room({
            roomCode: generateRoomCode(),
            players: [creatorCharacter],
            worldSeed: worldSeed || 'High Fantasy',
            storyHistory: [{
                type: 'SYSTEM',
                author: 'System',
                content: `${username} created a '${worldSeed || 'High Fantasy'}' adventure!`,
            }],
        });

        const savedRoom = await newRoom.save();

        res.status(201).json({
            success: true,
            room: savedRoom,
            message: 'Room created successfully',
        });

    } catch (error) {
        console.error(colors.red(`[Room] Error creating room: ${error.message}`));
        res.status(500).json({
            success: false,
            message: 'Server error while creating room',
        });
    }
};

// @desc Get room details by room code
// @route GET /api/rooms/:roomCode
// @access Public

export const getRoom = async (req, res) => {
    try {
        const room = await Room.findOne({ roomCode: req.params.roomCode});
        if(room) {
            console.log(colors.green(`[Room] Room fetched with code: ${room.roomCode}`));
            res.status(200).json({
                success: true,
                room,
            });
        } else {
            console.log(colors.yellow(`[Room] Room not found with code: ${req.params.roomCode}`));
            res.status(404).json({
                success: false,
                message: 'Room not found',
            });
        }
    } catch (error) {
        console.error(colors.red(`[Room] Error fetching room: ${error.message}`));
        res.status(500).json({
            success: false,
            message: 'Server Error while fetching room',
        });
    }
}