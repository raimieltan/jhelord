import { Request, Response, NextFunction } from 'express';
import {createUser, findUserById, loginUserService} from '../services/userServices'

// Controller function for user registration
async function registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { username, email, password, role } = req.body;

  try {
    const user = await createUser(username, email, password, role);
    res.status(201).json(user);
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
}

// Controller function for user login
async function loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { username, password } = req.body;

  try {
    const token = await loginUserService(username, password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
}

async function getUserFromToken(req: any, res: Response): Promise<void> {
  const userId = req.user.userId; // Assuming your JWT payload has a userId field

  try {
    const user = await findUserById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export { registerUser, loginUser, getUserFromToken };
