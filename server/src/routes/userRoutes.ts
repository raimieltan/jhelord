import express from 'express';
import { registerUser, loginUser, getUserFromToken } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';
const router = express.Router();

// Define routes for user registration and login
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateToken, getUserFromToken);

export default router;
