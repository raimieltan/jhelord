import { Request, Response } from 'express';
import * as userService from '../services/userServices';
import { UserCreateInput, UserProfileUpdateInput } from '../../types/user';


export async function signup(req: Request, res: Response) {
  try {
      const token = await userService.signupUser(req.body);
      res.status(201).json({ token });
  } catch (error:any) {
      if (error instanceof Error) {
          res.status(400).json({ message: error.message });
      } else {
          res.status(500).json({ message: 'An unexpected error occurred' });
      }
  }
}

export async function login(req: Request, res: Response) {
  try {
      const { username, password } = req.body;
      const token = await userService.loginUser(username, password);
      res.status(200).json({ token });
  } catch (error:any) {
      if (error instanceof Error) {
          res.status(401).json({ message: error.message });
      } else {
          res.status(500).json({ message: 'An unexpected error occurred' });
      }
  }
}

export async function getUserFromToken(req: any, res: Response): Promise<void> {
  // Log for debugging purposes
  console.log('req.user:', req.user);

  // Check if user information is present in req
  if (!req.user || !req.user.userId) {
      res.status(404).json({ error: 'User not found' });
      return;
  }

  try {
      const userId = Number(req.user.userId);
      const user = await userService.getUserProfile(userId);
      
      // Check if user was found
      if (!user) {
          res.status(404).json({ error: 'User not found' });
      } else {
          res.json(user); // Send back the user profile instead of req.user
      }
  } catch (error:any) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createUser(req: Request, res: Response) {
    const userData: UserCreateInput = req.body;
    try {
        const user = await userService.createUser(userData);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function getUserProfile(req: Request, res: Response) {
    const userId = parseInt(req.params.userId);
    try {
        const profile = await userService.getUserProfile(userId);
        res.status(200).json(profile);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
}

export async function updateUserProfile(req: Request, res: Response) {
    const userId = parseInt(req.params.userId);
    const profileData: UserProfileUpdateInput = req.body;
    try {
        const updatedProfile = await userService.updateUserProfile(userId, profileData);
        res.status(200).json(updatedProfile);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function deleteUser(req: Request, res: Response) {
    const userId = parseInt(req.params.userId);
    try {
        await userService.deleteUser(userId);
        res.status(204).send();
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}
