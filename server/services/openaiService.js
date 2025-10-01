import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const generateStoryResponse = async (storyHistory, newAction) => {
    const recentHistory = storyHistory.slice(-6).map(entry => `${entry.author}: ${entry.content}`).join('\n');

    const prompt = `
        You are a creative and engaging Dungeon Master for a collaborative storytelling game.
        Your role is to describe the world, the outcomes of player actions, and narrate the story.
        Keep your responses concise, descriptive, and move the story forward.
        Never break character. Your output must only be the story narration.

        Here is the recent story history for context:
        ---
        ${recentHistory}
        ---
        A player has just taken the following action:
        ${newAction.author}: ${newAction.content}

        Narrate the outcome.
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: prompt }],
            temperature: 0.8,
            max_tokens: 150,
        });
        console.log(colors.magenta('[OpenAI] Story response generated successfully'));
        return response.choices[0].message.content.trim();
    }
    catch (error) {
        console.error(colors.red(`[OpenAI] Error generating story response: ${error.message}`));
        return "The Dungeon Master seems to be pondering... (An error occurred)";
    }
}