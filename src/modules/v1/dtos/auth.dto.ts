export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    subscription: string;
  };
}