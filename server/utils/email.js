import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import colors from 'colors';
import axios from 'axios';

dotenv.config();

const sendEmail = async (options) => {
    const url = 'https://api.brevo.com/v3/smtp/email';

    const headers = {
        'Accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
    };

    const body = {
        sender: {
            name: 'StoryForge RPG',
            email: process.env.EMAIL_FROM,
        },
        to: [
            {
                email: options.email,
            },
        ],
        subject: options.subject,
        textContent: options.message,
    };

    try {
        await axios.post(url, body, { headers });
        console.log(colors.green(`[Email API] Email sent to ${options.email}`));
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error(colors.red(`[Email API] Error sending email: ${errorMessage}`));
    }
}

export default sendEmail;