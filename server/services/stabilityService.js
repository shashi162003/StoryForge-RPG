import axios from 'axios';
import colors from 'colors';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

const API_HOST = 'https://api.stability.ai';

export const generateImage = async (prompt) => {
    const apiKey = process.env.STABILITY_API_KEY;
    if (!apiKey) {
        console.error(colors.red('[StabilityAI] API key is missing.'));
        return null;
    }

    const url = `${API_HOST}/v2beta/stable-image/generate/core`;

    const formData = new FormData();
    formData.append('prompt', `masterpiece, best quality, high resolution, detailed, cinematic lighting, ${prompt}`);
    formData.append('output_format', 'png');

    const headers = {
        ...formData.getHeaders(),
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
    };

    try {
        console.log(colors.cyan('[StabilityAI] Sending request to SD3 API...'));
        const { data } = await axios.post(url, formData, { headers });

        const image = data.image;
        const base64Image = `data:image/png;base64,${image}`;

        console.log(colors.green('[StabilityAI] Image generated successfully.'));
        return base64Image;

    } catch (error) {
        console.error(colors.red(`[StabilityAI] Error: ${error.response?.data?.errors[0] || error.message}`));
        return null;
    }
};