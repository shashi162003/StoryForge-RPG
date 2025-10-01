import express from 'express';
import { registerUser, loginUser, verifyOTP, getMe } from '../controllers/authController.js';
import passport from 'passport';
import sendToken from '../utils/jwt.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        sendToken(req.user, 200, res, true);
    }
);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/login', session: false }),
    (req, res) => {
        sendToken(req.user, 200, res, true);
    }
);

router.get('/me', protect, getMe);

export default router;