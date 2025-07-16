export interface User {
  id?: number; 
  username: string;
  email: string;
  password: string;
  phoneNumber:string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  jwt: string; 
  message: string;
  id: number;
  displayName: string; 
  email: string;
  role: string; 
}