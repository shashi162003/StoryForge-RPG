import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import colors from 'colors';

dotenv.config();

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(colors.green(`[Email] Email sent to ${options.email}`));
    } catch (error) {
        console.error(colors.red(`[Email] Error sending email: ${error.message}`));
    }
}

export default sendEmail;