export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export interface LoginResponse {
  jwt: string; 
  message?: string;
  id?: number; 
  username?: string; 
  email?: string; 
  role?: UserRole;
}