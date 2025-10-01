import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import colors from 'colors';
import connectDB from './config/db.js';
import roomRoutes from './routes/roomRoutes.js';
import {createServer} from 'http';
import {Server} from 'socket.io';
import initializeSocket from './socket/socketHandler.js';
import authRoutes from './routes/authRoutes.js';
import configurePassport from './config/passport.js';
import passport from 'passport';

dotenv.config();

connectDB();
configurePassport(passport);

const app = express();
app.use(passport.initialize());
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});

initializeSocket(io);

const PORT = process.env.PORT || 5000;

app.use(cors());
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

httpServer.listen(PORT, () => {
    console.log(colors.cyan(`[Server] Server is running on port ${PORT}`));
});