import colors from 'colors';
import Room from '../models/Room.js';
import { openai, generateStoryResponse } from '../services/openaiService.js';
import { generateImage } from '../services/stabilityService.js';
import { createImagePrompt, updateNpcMemory } from '../utils/promptHelpers.js';

const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(colors.magenta(`[Socket] New client connected: ${socket.id}`));

        socket.on('join-room', async ({ roomCode, username }) => {
            try {
                socket.join(roomCode);
                console.log(colors.magenta(`[Socket] User ${username} (${socket.id}) joined room: ${roomCode}`));

                const newCharacter = {
                    username: username,
                    socketId: socket.id,
                    characterName: `Adventurer ${username}`,
                    description: 'A brave soul ready for adventure.',
                    attributes: {
                        strength: Math.floor(Math.random() * 6) + 8,
                        wits: Math.floor(Math.random() * 6) + 8,
                        charisma: Math.floor(Math.random() * 6) + 8,
                    }
                };
                const systemMessage = {
                    type: 'SYSTEM',
                    author: 'System',
                    content: `${username} has joined the adventure!`,
                };

                const updatedRoom = await Room.findOneAndUpdate(
                    { roomCode, 'players.username': { $ne: username } },
                    {
                        $push: {
                            players: newCharacter,
                            storyHistory: systemMessage
                        }
                    },
                    { new: true }
                );

                const finalRoomState = updatedRoom || await Room.findOne({ roomCode });

                io.to(roomCode).emit('room-update', finalRoomState);

            } catch (error) {
                console.error(colors.red(`[Socket] Error in join-room: ${error.message}`));
            }
        });
        socket.on('update-character', async ({ roomCode, username, characterName, description }) => {
            try {
                const room = await Room.findOne({ roomCode });
                if (!room) return;

                const characterIndex = room.players.findIndex(p => p.username === username);
                if (characterIndex !== -1) {
                    room.players[characterIndex].characterName = characterName;
                    room.players[characterIndex].description = description;
                    await room.save();
                    io.to(roomCode).emit('room-update', room);
                }
            } catch (error) {
                console.error(colors.red(`[Socket] Error updating character: ${error.message}`));
            }
        });

        socket.on('send-action', async ({ roomCode, username, actionText }) => {
            try {
                let room = await Room.findOne({ roomCode });
                if (!room) return;

                const actingCharacter = room.players.find(p => p.username === username);
                if (!actingCharacter) return;

                const playerAction = {
                    type: 'ACTION',
                    author: actingCharacter.characterName,
                    content: actionText,
                };

                const aiResponseContent = await generateStoryResponse(
                    room.storyHistory,
                    playerAction,
                    room.worldSeed,
                    actingCharacter,
                    room.npcMemory
                );

                const aiNarration = { type: 'NARRATION', author: 'DM', content: aiResponseContent };

                room.storyHistory.push(playerAction, aiNarration);
                await room.save();

                io.to(roomCode).emit('room-update', room);
                console.log('3. [Backend] Broadcasting text update to clients.');

                const newNpcMemory = await updateNpcMemory(room.storyHistory, room.npcMemory);
                room.npcMemory = newNpcMemory;
                await room.save();
                console.log(colors.yellow('[Memory] NPC Memory has been updated.'));
               
                const narrations = room.storyHistory.filter(e => e.type === 'NARRATION');
                if (narrations.length > 0 && narrations.length % 3 === 0) {
                    const imagePrompt = await createImagePrompt(room.storyHistory);
                    if (imagePrompt) {
                        const base64Image = await generateImage(imagePrompt);
                        if (base64Image) {
                            const imageEntry = { type: 'IMAGE', author: 'System', content: base64Image };
                            room.storyHistory.push(imageEntry);
                            await room.save();
                            io.to(roomCode).emit('room-update', room);
                            console.log('4. [Backend] Broadcasting image update to clients.');
                        }
                    }
                }
            } catch (error) {
                console.error(colors.red(`[Socket] Error handling action: ${error.message}`));
            }
        });

        socket.on('send-whisper', async ({ roomCode, username, actionText }) => {
            try {
                const room = await Room.findOne({ roomCode });
                if (!room) return;

                const actingCharacter = room.players.find(p => p.username === username);
                if (!actingCharacter) return;

                const whisperPrompt = `You are a Dungeon Master. A player is performing a secret action... The player's character sheet is: Strength ${actingCharacter.attributes.strength}, Wits ${actingCharacter.attributes.wits}, Charisma ${actingCharacter.attributes.charisma}. The secret action is: "${actionText}". Narrate the private outcome:`;

                const response = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "system", content: whisperPrompt }],
                    max_tokens: 100,
                });

                const privateNarration = response.choices[0].message.content.trim();
                socket.emit('private-update', {
                    type: 'WHISPER_RESPONSE',
                    author: 'DM (Private)',
                    content: privateNarration,
                });
                console.log(colors.cyan(`[Socket] Sent private response to ${username}`));

            } catch (error) {
                console.error(colors.red(`[Socket] Error handling whisper: ${error.message}`));
            }
        });

        socket.on('disconnect', async () => {
            console.log(colors.yellow(`[Socket] Client disconnected: ${socket.id}`));

            try {
                const room = await Room.findOne({ 'players.socketId': socket.id });
                if (room) {
                    const leavingPlayer = room.players.find(p => p.socketId === socket.id);

                    if (leavingPlayer) {
                        room.players = room.players.filter(p => p.socketId !== socket.id);

                        room.storyHistory.push({
                            type: 'SYSTEM',
                            author: 'System',
                            content: `${leavingPlayer.username} has left the adventure.`,
                        });

                        await room.save();

                        io.to(room.roomCode).emit('room-update', room);
                        console.log(colors.yellow(`[Room] Player ${leavingPlayer.username} left room ${room.roomCode}.`));
                    }
                }
            } catch (error) {
                console.error(colors.red(`[Socket] Error handling disconnect: ${error.message}`));
            }
        });
    });
};

export default initializeSocket;