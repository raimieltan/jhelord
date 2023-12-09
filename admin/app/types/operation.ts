import { Customer } from "./customer";
import { Unit } from "./unit";

export interface Operation {
  id: number;
  driverId: number;
  unitId: number;
  customerId: number;
  location: String;
  status: String;
  runTime: String;
  customer: Customer;
  unit: Unit;
  createdAt?: Date;
  updatedAt?: Date;
}