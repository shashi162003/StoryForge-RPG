import express from 'express';
import { createRoom, getRoom } from '../controllers/roomController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createRoom);
router.get('/:roomCode', protect, getRoom);

export default router;