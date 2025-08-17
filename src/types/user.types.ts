export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  subscription: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}