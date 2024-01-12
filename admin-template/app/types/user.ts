import { Booking } from "./booking";

export interface User{
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  phoneNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
  booking: Booking[];
}