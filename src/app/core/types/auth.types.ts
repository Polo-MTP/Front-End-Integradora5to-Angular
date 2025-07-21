export interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
  rol: string;
  profileImage: string | null;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  profileImage: string | null;
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: User;
  profileImage: string | null;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
  profileImage: string | null;
}

export interface ApiErrorResponse {
  message: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface UpdateUserData {
  fullName: string;
  email: string;
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  user: User;
}
