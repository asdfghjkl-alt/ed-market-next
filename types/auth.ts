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
  role: "buyer" | "seller" | "admin";
  email: string;
}
