import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';
import { AuthResponse } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onLogin() {
  this.authService.login(this.credentials).subscribe({
    next: (user) => {
      console.log("Login success", user);
      this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
        this.router.navigate(['/']);
    },
    error: (error) => {
      console.error("Login error:", error);

      this.credentials.password = '';

        let errorMessage = 'Login failed. Please try again.';

        if (error.error) {
          if (error.error.message) {
            errorMessage = error.error.message;
          } else if (typeof error.error === 'string') {
            errorMessage = error.error; 
          }
        }

        if (error.status === 401) { 
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (error.status === 403) { 
          errorMessage = 'Access denied. Your account might be inactive or locked.';
        } else if (error.status === 404) { 
          errorMessage = 'User not found or server error. Please try again.';
        }

      this.snackBar.open("Login failed: " + (error.error || "Invalid credentials"), "Close", { duration: 3000 });
    }
  });
}
}