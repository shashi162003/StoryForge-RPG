import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import colors from 'colors';
import passport from 'passport';
import { createServer } from 'http';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import configurePassport from './config/passport.js';
import initializeSocket from './socket/socketHandler.js';
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';

dotenv.config();
connectDB();
configurePassport(passport);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'];
        console.log("==== CORS CHECK ====");
        console.log("INCOMING ORIGIN:", origin);
        console.log("ALLOWED ORIGINS:", allowedOrigins);
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Storyforge RPG API is running!'
    });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: (origin, callback) => {
            const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'];
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST'],
    }
});
initializeSocket(io);

httpServer.listen(PORT, () => {
    console.log(colors.cyan(`[Server] Server is running on port ${PORT}`));
});