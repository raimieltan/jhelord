export interface Driver {
  id: number;
  firstName: String;
  lastName: String;
  licenseNo: String;
  address: String;
  birthDate: String;
  createdAt?: Date;
  updatedAt?: Date;
}