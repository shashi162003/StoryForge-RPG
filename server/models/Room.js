import mongoose from "mongoose";

// Schema for each individual entry in the story log
const storyEntrySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['NARRATION', 'ACTION', 'SYSTEM', 'IMAGE'], // NARRATION from AI, ACTION from player, SYSTEM for joining/leaving
        required: true,
    },
    author: {
        type: String, // 'DM' for NARRATION, username for ACTION, 'System' for SYSTEM
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const characterSchema = new mongoose.Schema({
    username: { type: String, required: true },
    socketId: { type: String },
    characterName: { type: String, required: true },
    description: { type: String },
    attributes: {
        strength: { type: Number, default: 10 },
        wits: { type: Number, default: 10 },
        charisma: { type: Number, default: 10 },
    },
});

const roomSchema = new mongoose.Schema(
    {
        roomCode: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        players: [characterSchema],
        storyHistory: [storyEntrySchema],
        worldSeed: {
            type: String,
            default: 'High Fantasy',
        },
        npcMemory: {
            type: String,
            default: 'No important NPCs have been introduced yet.',
        },
    },
    {
        timestamps: true,
    }
)

const Room = mongoose.model('Room', roomSchema);

export default Room;