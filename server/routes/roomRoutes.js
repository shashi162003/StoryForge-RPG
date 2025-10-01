import express from 'express';
import { createRoom, getRoom } from '../controllers/roomController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createRoom);
router.get('/:roomCode', getRoom);

export default router;