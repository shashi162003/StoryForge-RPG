import colors from 'colors';
import Room from '../models/Room.js';
import { generateStoryResponse } from '../services/openaiService.js';

const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(colors.magenta(`[Socket] New client connected: ${socket.id}`));
        
        socket.on('join-room', ({roomCode, username}) => {
            socket.join(roomCode);
            console.log(colors.magenta(`[Socket] User ${username} joined room: ${roomCode}`));
            io.to(roomCode).emit('user-joined', {username, message: `${username} has joined the adventure!`});
        })

        socket.on('send-action', async ({roomCode, username, actionText}) => {
            try {
                const playerAction = {
                    type: 'ACTION',
                    author: username,
                    content: actionText,
                };

                const roomBeforeAI = await Room.findOne({ roomCode });
                const aiResponseContent = await generateStoryResponse(roomBeforeAI.storyHistory, playerAction);

                const aiNarration = {
                    type: 'NARRATION',
                    author: 'DM',
                    content: aiResponseContent,
                };

                const updatedRoom = await Room.findOneAndUpdate(
                    {roomCode},
                    {$push: {storyHistory: {
                        $each: [playerAction, aiNarration],
                    }}},
                    {new: true}
                );

                io.to(roomCode).emit('room-update', updatedRoom);
            } catch(error) {
                console.error(colors.red(`[Socket] Error handling action: ${error.message}`));
                socket.emit('action-error', {
                    message: 'There was an error handling your action',
                })
            }
        });

        socket.on('disconnect', () => {
            console.log(colors.yellow(`[Socket] Client disconnected: ${socket.id}`));
        })
    })
}

export default initializeSocket;