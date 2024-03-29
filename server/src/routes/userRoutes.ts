import express from 'express';
import * as userController from '../controllers/userController';
import * as authMiddleware from  '../middlewares/authMiddleware'
import multer from 'multer';

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
      cb(null, 'src/uploads'); // Make sure this folder exists
    },
    filename: function (req: any, file: any, cb: any) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });


router.post('/signup', upload.single('profileImage'), userController.signup);
router.post('/signup-driver', upload.single('profileImage'), userController.signupDriver);
router.put('/update-driver/:id', upload.single('profileImage'), userController.updateDriver);
router.post('/login', userController.login);
router.post('/users', userController.createUser);
router.get('/:userId/profile', authMiddleware.authenticateToken, userController.getUserProfile);
router.delete('/users/:userId', authMiddleware.authenticateToken, userController.deleteUser);
router.get('/profile', authMiddleware.authenticateToken, userController.getUserFromToken);
router.get('/username', userController.getUserNames);
router.get('/', userController.getUsers);
router.post('/change-password', userController.changePassowrd);
router.delete('/delete-account/:id', userController.deleteAccount);
export default router;
