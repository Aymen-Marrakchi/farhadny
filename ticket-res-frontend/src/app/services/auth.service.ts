import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { User ,AuthResponse ,LoginRequest } from '../models/user.model';
import { LoginResponse, UserRole } from '../models/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8081/api/auth'; 
  private tokenKey = 'jwtToken';
  private roleKey = 'userRole';
  private userIdKey = 'currentUserId';
  private userEmailKey = 'userEmail';

  private _isAuthenticated = new BehaviorSubject<boolean>(false);

  public isAuthenticated$: Observable<boolean> = this._isAuthenticated.asObservable();

  private _userRole = new BehaviorSubject<UserRole | null>(null);
  public userRole$: Observable<UserRole | null> = this._userRole.asObservable();

  private _userId = new BehaviorSubject<number | null>(null); 
  public userId$: Observable<number | null> = this._userId.asObservable();

  private _userEmail = new BehaviorSubject<string | null>(null);
  public userEmail$: Observable<string | null> = this._userEmail.asObservable();

  constructor(private http: HttpClient) {
    this.checkTokenAndRoleOnLoad();
   }

   private checkTokenAndRoleOnLoad(): void {
    const token = localStorage.getItem(this.tokenKey);
    const storedRole = localStorage.getItem(this.roleKey);
    const storedUserId = localStorage.getItem(this.userIdKey);
    const storedEmail = localStorage.getItem(this.userEmailKey);

    const isLoggedIn = !!token;
    this._isAuthenticated.next(isLoggedIn);

    if (isLoggedIn && storedRole) {
      try {
        this._userRole.next(UserRole[storedRole as keyof typeof UserRole]);
      } catch (e) {
        console.error('Error parsing stored user role:', storedRole, e);
        this._userRole.next(null); 
      }
    } else {
      this._userRole.next(null);
    }

    if (storedUserId) {
      this._userId.next(Number(storedUserId)); 
    } else {
      this._userId.next(null);
    }

    if (storedEmail) {
      this._userEmail.next(storedEmail);
    } else {
      this._userEmail.next(null);
    }

    console.log('AuthService: Initial isAuthenticated status:', this._isAuthenticated.value);
    console.log('AuthService: Initial user role:', this._userRole.value);
    console.log('AuthService: Initial user email:', this._userEmail.value);
  }

  register(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

   login(credentials: LoginRequest): Observable<AuthResponse> {
     return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials, {
       headers: new HttpHeaders({
         'Content-Type': 'application/json'
       })
     }).pipe(
      tap(response => {
        if (response && response.jwt) {
          localStorage.setItem(this.tokenKey, response.jwt);
          this._isAuthenticated.next(true);

          if (response.role) {
            localStorage.setItem(this.roleKey, response.role); 
            this._userRole.next(UserRole[response.role as keyof typeof UserRole]);
            console.log('AuthService: Login successful, isAuthenticated set to true, role stored:', response.role);
          } else {
            localStorage.removeItem(this.roleKey);
            this._userRole.next(null);
            console.warn('AuthService: Login response did not contain a user role.');
          }
          if (response.id) { 
            localStorage.setItem(this.userIdKey, response.id.toString()); // Store as string
            this._userId.next(response.id); 
            console.log('AuthService: User ID stored:', response.id);
          } else {
            localStorage.removeItem(this.userIdKey);
            this._userId.next(null);
            console.warn('AuthService: Login response did not contain a user ID (id field).');
          }
          
          if (response.email) { 
            localStorage.setItem(this.userEmailKey, response.email);
            this._userEmail.next(response.email); 
            console.log('AuthService: User email stored:', response.email);
          } else {
            localStorage.removeItem(this.userEmailKey);
            this._userEmail.next(null);
            console.warn('AuthService: Login response did not contain a user email.');
          }
        } else {
          this.clearAuthData();
          console.error('AuthService: Login successful, but no JWT token found in response. Authentication failed.');
          throw new Error('Authentication failed: No token received from server.');
        }
      })
    );
   }

   public logout(): void { 
    this._isAuthenticated.next(false);
    console.log('User logged out. Authentication status set to false.');
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.userEmailKey);
    this._isAuthenticated.next(false);
    this._userRole.next(null);
    this._userId.next(null);
    this._userEmail.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUserRole(): UserRole | null {
    return this._userRole.value;
  }

  getUserId(): number | null {
    return this._userId.value;
  }

  isLoggedIn(): boolean {
    return this._isAuthenticated.value;
  }

  getLoggedInUserEmail(): string | null {
    return this._userEmail.value;
  }

  getCurrentUserId(): string | null {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user.id || null; 
  }


  hasRole(requiredRole: UserRole): boolean {
    const currentRole = this.getCurrentUserRole();
    return this._isAuthenticated.value && currentRole === requiredRole;
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN) || this.hasRole(UserRole.SUPER_ADMIN);
  }

  isSuperAdmin(): boolean {
    return this.hasRole(UserRole.SUPER_ADMIN,);
  }

  private handleError(error: any): Observable<never> {
    console.error('AuthService: An error occurred:', error);
    let errorMessage = 'An unexpected error occurred.';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (typeof error.error === 'string') {
      errorMessage = error.error;
    } else if (error.message) {
        errorMessage = error.message;
    }
    if (error.status === 401 || error.status === 403) {
      this.clearAuthData();
    }
    return throwError(() => new Error(errorMessage));
  }

}
