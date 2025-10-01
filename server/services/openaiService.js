import { OpenAI } from "openai";
import dotenv from "dotenv";
import colors from "colors";

dotenv.config();

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getSystemPrompt = (worldSeed) => {
    const prompts = {
        'High Fantasy': `You are a creative Dungeon Master for a 'High Fantasy' game like Dungeons & Dragons. Your world is filled with magic, mythical creatures, ancient ruins, and epic quests. Narrate in a descriptive, Tolkienesque style.`,
        'Cyberpunk Noir': `You are a grim Game Master for a 'Cyberpunk Noir' game. Your world is a rain-slicked metropolis of neon signs, mega-corporations, and cybernetically enhanced detectives. Narrate in a hardboiled, cynical style like a classic noir film.`,
        'Cosmic Horror': `You are the Keeper of Arcane Lore for a 'Cosmic Horror' game in the style of Lovecraft. The world appears normal, but underneath lies a terrifying reality of incomprehensible entities and creeping madness. Emphasize a sense of dread, mystery, and the insignificance of humanity.`,
    };
    return prompts[worldSeed] || prompts['High Fantasy'];
}

export const generateStoryResponse = async (storyHistory, newAction, worldSeed, character, npcMemory) => {
    const recentHistory = storyHistory.slice(-6).map(entry => `${entry.author}: ${entry.content}`).join('\n');

    const systemMessage = getSystemPrompt(worldSeed);

    const characterSheet = `
        The player taking this action has the following character:
        - Name: ${character.characterName}
        - Description: ${character.description}
        - Attributes: Strength ${character.attributes.strength}, Wits ${character.attributes.wits}, Charisma ${character.attributes.charisma}.
        (A stat of 10 is average. Higher is better.)
    `;

    const prompt = `
        ${systemMessage}
        ${characterSheet}

        ---
        NPC Memory (Remember these characters):
        ${npcMemory}
        ---

        Your role is to describe the world and the outcomes of player actions. When an action is uncertain, use their attributes to influence the outcome. For example, a character with high Strength is more likely to succeed at breaking down a door. A character with low Charisma might fail to persuade someone. Narrate these outcomes naturally.
        
        Here is the recent story history:
        ---
        ${recentHistory}
        ---
        The player has just taken the following action:
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