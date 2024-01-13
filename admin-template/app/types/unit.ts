import { Driver } from "./driver";

export interface Unit {
  id: number,
  driverId: number,
  driver: Driver,
  model: string,
  make: string,
  number: string,
  plateNumber: string,
  runTime: Date,
  status: string,
  location: any,
}