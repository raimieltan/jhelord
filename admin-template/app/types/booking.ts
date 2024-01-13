import { User } from "./user";
import { Driver } from "./driver";

export interface Booking {
  id: number;
  driverId: number;
  userId: number;
  status: String;
  location: String;
  createdAt?: Date;
  User: User;
  driver: Driver;
}