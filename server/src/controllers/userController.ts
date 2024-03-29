import { Request, Response } from 'express'
import * as userService from '../services/userServices'
import { UserCreateInput, UserProfileUpdateInput } from '../../types/user'
import { Prisma } from '@prisma/client'

export async function signup(req: any, res: any) {
  try {
    let profileImagePath = ''
    if (req.file) {
      profileImagePath = req.file.path
    }

    const token = await userService.signupUser({
      ...req.body,
      profileImage: profileImagePath, // Add the image path to the user data
    })
    res.status(201).json({ token })
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' })
    }
  }
}

export async function signupDriver(req: any, res: any) {
  try {
    let profileImagePath = ''
    if (req.file) {
      profileImagePath = req.file.path
    }

    const user = await userService.signupDriver({
      ...req.body,
      profileImage: profileImagePath,
    })
    res.status(201).json(user)
  } catch (error: any) {
    console.log(error.message)
  }
}

export async function updateDriver(req: any, res: any) {
  try {
    let profileImagePath = ''
    if (req.file) {
      profileImagePath = req.file.path
    }
    const driverId = req.params.id;
    const user = await userService.editUser(parseInt(driverId), {
      ...req.body,
      profileImage: profileImagePath,
    })
    res.status(201).json(user)
  } catch (error: any) {
    console.log(error.message)
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body
    const token = await userService.loginUser(username, password)
    res.status(200).json({ token })
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' })
    }
  }
}

export async function getUserFromToken(req: any, res: Response): Promise<void> {
  // Log for debugging purposes
  console.log('req.user:', req.user)

  // Check if user information is present in req
  if (!req.user || !req.user.userId) {
    res.status(404).json({ error: 'User not found' })
    return
  }

  try {
    const userId = Number(req.user.userId)
    const user = await userService.getUserProfile(userId)

    // Check if user was found
    if (!user) {
      res.status(404).json({ error: 'User not found' })
    } else {
      res.json(user) // Send back the user profile instead of req.user
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function createUser(req: Request, res: Response) {
  const userData: UserCreateInput = req.body
  try {
    const user = await userService.createUser(userData)
    res.status(201).json(user)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export async function getUserProfile(req: Request, res: Response) {
  const userId = parseInt(req.params.userId)
  try {
    const profile = await userService.getUserProfile(userId)
    res.status(200).json(profile)
  } catch (error: any) {
    res.status(404).json({ message: error.message })
  }
}

export async function getUserNames(req: Request, res: Response) {
  try {
    const users = await userService.retrieveUserNames()
    res.status(200).json(users)
  } catch (error: any) {
    res.status(404).json({ message: error.message })
  }
}

export async function deleteUser(req: Request, res: Response) {
  const userId = parseInt(req.params.userId)
  try {
    await userService.deleteUser(userId)
    res.status(204).send()
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await userService.retrieveUsers();
    res.json(users);
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export async function changePassowrd(req: Request, res: Response) {
  try {
    const { id, password} = req.body
    const users = await userService.changeUserPassword(id, password);
    res.json(users);
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export async function deleteAccount(req: Request, res: Response) {
  try {
    const id  = req.params.id
    console.log(id)
    await userService.deleteFunction(Number(id))
    res.json({message: "deleted account"})

  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
