import { Unit } from "./unit";
import { User } from "./user";

export interface Driver {
  id: number;
  firstName: String;
  lastName: String;
  licenseNo: String;
  address: String;
  birthDate: String;
  status: String;
  createdAt?: Date;
  updatedAt?: Date;
  unit: Unit[];
  driverReview: any[];
  User: User;
}