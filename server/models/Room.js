import mongoose from "mongoose";

// Schema for each individual entry in the story log
const storyEntrySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['NARRATION', 'ACTION', 'SYSTEM'], // NARRATION from AI, ACTION from player, SYSTEM for joining/leaving
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

const roomSchema = new mongoose.Schema(
    {
        roomCode: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        players: [
            {
                type: String,
            },
        ],
        storyHistory: [storyEntrySchema],
    },
    {
        timestamps: true,
    }
)

const Room = mongoose.model('Room', roomSchema);

export default Room;