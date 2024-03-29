import { Prisma, PrismaClient, UserRole } from '@prisma/client';
import { UserCreateInput, UserProfileUpdateInput } from '../../types/user';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient();

const saltRounds = 10; // for bcrypt


export async function signupUser(userData: UserCreateInput) {
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    const newUser = await prisma.user.create({
        data: {
            ...userData,
            password: hashedPassword,
        }
    });

    const token = jwt.sign({ userId: newUser.id, username: newUser.username }, process.env.JWT_SECRET as string);
    return token;
}
export async function signupDriver(userData: UserCreateInput) {
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    const newUser = await prisma.user.create({
        data: {
            ...userData,
            password: hashedPassword,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            phoneNumber: true,
            profileImage: true,
        }
    });

    return newUser;
}

export async function loginUser(username: string, password: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
        throw new Error('Invalid username or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        throw new Error('Invalid username or password');
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET as string);

    return token;
}

export async function editUser(userId: number, userData: UserCreateInput) {
    return await prisma.user.update({
        where: {
            id: userId,
        },
        data: userData,
    })
}

export async function createUser(userData: UserCreateInput) {
    return await prisma.user.create({
        data: userData,
    });
}

export async function getUserProfile(userId: number) {

    return await prisma.user.findUnique({
        where: { id: userId },

    });
}

export async function deleteUser(userId: number) {
    return await prisma.user.delete({
        where: { id: userId },
    });
}

export async function retrieveUserNames() {
    return await prisma.user.findMany({
        where: { role: 'DRIVER'},
        select: {
            username: true,
        }
    })
}

export async function retrieveUsers() {
    return await prisma.user.findMany({
        select: {
            username: true,
            email: true,
            phoneNumber: true,
            driver: true,
            role: true,
        }
    })
}

export async function changeUserPassword(userId: number, newPassword: string) {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the user's password in the database
        return await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });


}

    export async function deleteFunction(id: number) {

        console.log(id)
        await prisma.driverReview.deleteMany({
            where: {
                userId: id
            }
        })
        await prisma.booking.deleteMany({
            where: {
            userId: id,
            },
        });


        return await prisma.user.delete({
            where: {
                id: id
            }
        })
    }

