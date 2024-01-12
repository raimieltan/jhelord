import { UserRole } from "@prisma/client";

export interface UserCreateInput {
    username: string;
    email: string;
    password: string;
    role: UserRole; // Or use an enum for UserRole
    phoneNumber?: string;
    firstName :   string
    lastName  :   string
    profileImage? : string
  }


export interface UserProfileUpdateInput {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date | string;
    gender?: string;
    profileImage?: string;
  }