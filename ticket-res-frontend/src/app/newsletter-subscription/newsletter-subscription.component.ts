import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NewsletterService } from './../services/newsletter.service'; 
import { AuthService } from './../services/auth.service'; 
import { Subscription } from 'rxjs'; 
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; 

@Component({
  selector: 'app-newsletter-subscription',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule], 
  templateUrl: './newsletter-subscription.component.html', 
  styleUrls: ['./newsletter-subscription.component.scss'] 
})
export class NewsletterSubscriptionComponent implements OnInit, OnDestroy {
  loggedInUserEmail: string | null = null;
  isLoggedIn: boolean = false;
  message: string = '';
  isSubscribed: boolean = false;

  private authSubscription: Subscription | undefined; 

  constructor(
    private newsletterService: NewsletterService,
    private authService: AuthService, 
    private snackBar: MatSnackBar 
  ) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(status => {
      this.isLoggedIn = status;
      this.loggedInUserEmail = this.authService.getLoggedInUserEmail();
      this.checkSubscriptionStatus();
    });

    this.isLoggedIn = this.authService.isLoggedIn();
    this.loggedInUserEmail = this.authService.getLoggedInUserEmail();
    this.checkSubscriptionStatus(); 
  }


  private checkSubscriptionStatus(): void {
    if (this.loggedInUserEmail) {
      this.isSubscribed = false; 
    } else {
      this.isSubscribed = false;
    }
  }

  onSubscribe(): void {
    if (!this.isLoggedIn || !this.loggedInUserEmail) {
      this.message = 'Please log in to subscribe to the newsletter.';
      this.snackBar.open(this.message, 'Close', { duration: 3000, panelClass: ['snackbar-error'] });
      return; 
    }

    this.newsletterService.subscribe(this.loggedInUserEmail).subscribe({
      next: (response) => {
        this.message = 'Successfully subscribed to the newsletter!';
        this.isSubscribed = true;
        this.snackBar.open(this.message, 'Close', { duration: 3000, panelClass: ['snackbar-success'] });
        console.log('Subscription successful:', response);
      },
      error: (error) => {
        console.error('Subscription error:', error);
        if (error.error && error.error.message) {
          this.message = `Error: ${error.error.message}`;
        } else {
          this.message = 'Failed to subscribe. Please try again.';
        }
        this.snackBar.open(this.message, 'Close', { duration: 3000, panelClass: ['snackbar-error'] });
        this.isSubscribed = false;
      }
    });
  }

  onUnsubscribe(): void {
    if (!this.isLoggedIn || !this.loggedInUserEmail) {
      this.message = 'Please log in to unsubscribe from the newsletter.';
      this.snackBar.open(this.message, 'Close', { duration: 3000, panelClass: ['snackbar-error'] });
      return; 
    }

    this.newsletterService.unsubscribe(this.loggedInUserEmail).subscribe({
      next: () => {
        this.message = 'Successfully unsubscribed from the newsletter.';
        this.isSubscribed = false;
        this.snackBar.open(this.message, 'Close', { duration: 3000, panelClass: ['snackbar-success'] });
        console.log('Unsubscription successful.');
      },
      error: (error) => {
        console.error('Unsubscription error:', error);
        if (error.error && error.error.message) {
          this.message = `Error: ${error.error.message}`;
        } else {
          this.message = 'Failed to unsubscribe. Please try again.';
        }
        this.snackBar.open(this.message, 'Close', { duration: 3000, panelClass: ['snackbar-error'] });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}