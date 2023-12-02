import { PrismaClient, User as PrismaUser, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient();

// Types
interface User extends PrismaUser {}

// Function to create a new user
async function createUser(username: string, email: string, password: string, role: UserRole): Promise<User> {
  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Call Prisma to create the user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role,
    },
  });

  return user;
}

// Function to find a user by their ID
async function findUserById(userId: number): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  return user;
}

// Function to find a user by their username
async function findUserByUsername(username: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  return user;
}

// Function to find a user by their email
async function findUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
}

// Function to authenticate and generate a JWT token for a user
async function loginUserService(username: string, password: string): Promise<string> {
  // Find the user by username
  const user = await findUserByUsername(username);

  if (!user) {
    throw new Error('Invalid username or password');
  }

  // Compare the provided password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error('Invalid username or password');
  }

  console.log(process.env.JWT_SECRET)

  // Generate a JWT token
  const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET as string, {
    expiresIn: '1h', // Token expiration time
  });

  return token;
}

export { createUser, findUserById, findUserByUsername, findUserByEmail, loginUserService, User };
