export interface IUser {
  id?: number;
  firstName: string;
  lastName?: string;
  fullName: string;
  email: string;
  password?: string;
  avatar?: string;
  gender?: string;
  birthday?: Date;
  zipcode?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  number?: string;
  complement?: string;
  fullAddress: string;

  createdDate?: Date;
  updatedDate?: Date;
}