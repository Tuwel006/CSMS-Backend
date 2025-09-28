export enum roles {
  USER = "user",
  ADMIN = "admin",
  GUEST = "guest",
  SUBSCRIBER = "subscriber"
}

export interface UserAttributes {
  id?: number;
  username: string;
  email: string;
  password: string;
  roles?: roles;
  createdAt?: Date;
  updatedAt?: Date;
}