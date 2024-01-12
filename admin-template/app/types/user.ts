import { Booking } from "./booking";

export interface User{
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  phoneNumber: string;
  profileImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
  booking?: Booking[];
}