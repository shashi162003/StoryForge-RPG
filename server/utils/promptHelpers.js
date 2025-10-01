import { openai } from '../services/openaiService.js';

export const createImagePrompt = async (storyHistory) => {
    const recentHistory = storyHistory.slice(-4).map(entry =>
        `${entry.author}: ${entry.content}`
    ).join('\n');

    const prompt = `
    Based on the following recent events in a role-playing game, create a short, descriptive, visual prompt for an AI image generator.
    Focus on the characters, the environment, and the key action. Describe the scene as if you are describing a painting. Do not include character names.
    For example: "A lone warrior stands in a dark cave, holding a glowing sword."

    Recent Events:
    ---
    ${recentHistory}
    ---
    Visual Prompt:
  `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: prompt }],
            temperature: 0.5,
            max_tokens: 50,
        });
        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error("Error creating image prompt:", error);
        return null;
    }
};

export const updateNpcMemory = async (storyHistory, currentMemory) => {
    const recentHistory = storyHistory.slice(-4).map(entry =>
        `${entry.author}: ${entry.content}`
    ).join('\n');

    const prompt = `
    You are a memory assistant for a Dungeon Master AI. Your job is to maintain a brief, third-person summary of important Non-Player Characters (NPCs).
    
    Current Memory:
    ---
    ${currentMemory}
    ---

    Recent Events:
    ---
    ${recentHistory}
    ---

    Based on the recent events, provide an updated, concise summary of all important NPCs, their key personality traits, and their relationship to the players. If an NPC died, note that. If no important NPCs are present or mentioned, simply return the text "None".
  `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: prompt }],
            temperature: 0.3,
            max_tokens: 150,
        });
        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error("Error updating NPC memory:", error);
        return currentMemory;
    }
};