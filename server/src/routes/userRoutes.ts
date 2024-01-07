import express from 'express';
import * as userController from '../controllers/userController';
import * as authMiddleware from  '../middlewares/authMiddleware'

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/users', userController.createUser);
router.get('/:userId/profile', authMiddleware.authenticateToken, userController.getUserProfile);
router.put('/users/:userId/profile', authMiddleware.authenticateToken, userController.updateUserProfile);
router.delete('/users/:userId', authMiddleware.authenticateToken, userController.deleteUser);
router.get('/profile', authMiddleware.authenticateToken, userController.getUserFromToken);
export default router;
