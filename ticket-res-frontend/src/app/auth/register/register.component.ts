import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for basic directives if used
import { FormsModule } from '@angular/forms'; // Needed for template-driven forms
import { MatInputModule } from '@angular/material/input'; // For matInput
import { MatFormFieldModule } from '@angular/material/form-field'; // For mat-form-field
import { MatButtonModule } from '@angular/material/button'; // For mat-raised-button
import { AuthService } from '../../services/auth.service'; // Import your AuthService
import { User } from '../../models/user.model'; // Import your User model
import { Router } from '@angular/router'; // Import Router for navigation after registration
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user: User = {
    username: '',
    email: '',
    password: '',
    phoneNumber:''
  };
  confirmPassword :string = ''; 

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar 
  ) { }

  onRegister(): void {
    if (this.user.password !== this.confirmPassword) {
      this.snackBar.open('Passwords do not match!', 'Close', { duration: 3000 });
      return;
    }

    this.authService.register(this.user).subscribe({
      next: (response: any) => {
        console.log('Registration successful:', response);
        this.snackBar.open('Registration successful! You can now log in.', 'Close', { duration: 5000 });
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        console.error('Registration failed:', error);
        let errorMessage = 'Registration failed. Please try again.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message; 
        } else if (error.status === 409) { 
          errorMessage = 'Email or username already exists.';
        }
        this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
      }
    });
  }
}