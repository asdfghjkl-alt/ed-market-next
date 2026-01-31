export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  name: string;
}

export interface User {
  _id: string;
  name: string;
  role: IRole;
  email: string;
}

export enum IRole {
  buyer = "buyer",
  seller = "seller",
  admin = "admin",
}
