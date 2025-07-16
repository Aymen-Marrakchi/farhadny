import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export interface AppUser {
  id?: number; 
  email: string;
  password?: string;
  username: string;
  phoneNumber?: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8081/api/users'; 

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<AppUser> { 
    return this.http.get<AppUser>(`${this.apiUrl}/${id}`);
  }

  createAdminUser(user: AppUser): Observable<AppUser> {
    const userPayload = {
      email: user.email,
      username: user.username,
      password: user.password || '',
      phoneNumber: user.phoneNumber || null,
      role: user.role
    };
    return this.http.post<AppUser>(`${this.apiUrl}/admin/create`, user);
  }


  updateUser(id: number, user: AppUser): Observable<AppUser> {
    const userToUpdate = {
      id: user.id,
      email: user.email,
      username: user.username,
      phoneNumber: user.phoneNumber
    };
    return this.http.put<AppUser>(`${this.apiUrl}/${id}`, userToUpdate);
  }


  updateUserRole(id: number, newRole: UserRole): Observable<AppUser> { 
    return this.http.put<AppUser>(`${this.apiUrl}/${id}/role?newRole=${newRole}`, {});
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}