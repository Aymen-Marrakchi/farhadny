import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'; // Import MatToolbarModule
import { MatButtonModule } from '@angular/material/button';   // Import MatButtonModule
import { RouterModule, Router } from '@angular/router'; // For navigation links
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatToolbarModule, 
    MatButtonModule,
    MatIconModule,
    RouterModule 
  ],
  template: `
    <mat-toolbar class="transparent-toolbar">
  <span class="toolbar-title" routerLink="/">Farhadny</span>

  <span class="spacer"></span>

  <button class="mobile-menu-button" mat-icon-button (click)="toggleMenu()">
    <mat-icon clacc="but-mu" >menu</mat-icon>
  </button>

  <div class="nav-links" [class.open]="menuOpen">
  <ng-container *ngIf="!isSuperAdminUser">  
    <button mat-button class="nav-link" routerLink="/contact">Contact-Us</button>
  </ng-container>

    <ng-container *ngIf="!isLoggedIn">
      <button mat-button class="nav-link" routerLink="/register">Sign Up</button>
      <button mat-raised-button class="but-link" color="accent" routerLink="/login">Login</button>
    </ng-container>
    <ng-container *ngIf="isLoggedIn">
      <button mat-button class="nav-link" routerLink="/dashboard" *ngIf="isAdminUser">Dashboard</button>
      <button mat-button class="nav-link" routerLink="/my-orders">My Orders</button>
      <button mat-raised-button class="but-link" color="accent" (click)="onLogout()">Disconnect</button>
    </ng-container>
  </div>
</mat-toolbar>
  `,
  styles: [`
 .transparent-toolbar {
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 70px;
  padding: 0 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background-color 0.3s ease;
}
.transparent-toolbar.menu-open-background {
  background-color: white !important;
}

.toolbar-title {
  font-family: "Aboreto", Helvetica, sans-serif;
  font-size: 28px;
  color:#0a0056;
  font-weight: 500;
  letter-spacing: 0.5px;
  cursor: pointer;
  flex-grow: 1; /* Allows title to take available space */
  text-align: left;
}

.spacer {
  flex: 1 1 auto;
}

.nav-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.transparent-toolbar .mat-button {
  font-family: "DM Sans", sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: white;
  background: transparent;
  border: none;
  text-transform: none;
  margin: 0 10px;
}

.transparent-toolbar .mat-button:hover {
  background-color: #0a0056;
  border-radius: 30px;
}

.transparent-toolbar .mat-raised-button.mat-accent {
  font-family: "DM Sans", sans-serif;
  font-size: 16px;
  font-weight: 500;
  background-color: transparent;
  border: 1.5px solid white;
  color: white;
  border-radius: 50px;
  padding: 8px 20px;
  box-shadow: none;
  transition: 0.3s ease;
}

.transparent-toolbar .mat-raised-button.mat-accent:hover {
  background-color: white;
  color: #0a0056;
}

.mat-icon {
  color: white;
}



.transparent-toolbar a {
  color: white !important;
  text-decoration: none;
}

.mobile-menu-button {
  display: none;
  color: #0a0056 !important;
}


/* Mobile responsive behavior */
@media (max-width: 768px) {
  .transparent-toolbar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 70px;
  }

  .toolbar-title {
    font-size: 24px;
    margin-bottom: 0;
    flex-grow: 1;
    text-align: left;
  }

  .spacer {
    display: none;
  }

  .mobile-menu-button {
    display: inline-flex;
    order: 2;
    margin-left: auto;
  }

  .nav-links {
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    display: none;
    flex-direction: column;
    width: 100%;
    background-color: white; /* Default background for closed menu, will be overridden by .open */
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    padding: 10px 0;
    z-index: 999;
  }

  .nav-links.open {
    display: flex; /* Show menu when open */
    background-color: white; /* White background when open */
  }

  .nav-links button,
  .nav-links .mat-menu-item {
    width: 100%;
    text-align: left;
    justify-content: flex-start;
    padding-left: 20px;
    color: #0a0056 !important; /* Dark text for white background */
    background: transparent !important;
    border-radius: 0 !important;
  }

  .nav-links button:hover,
  .nav-links .mat-menu-item:hover {
    background-color: #f0f0f0 !important;
  }

  .nav-links .but-link {
    background-color: transparent !important;
    border: 2px solid #0a0056 !important;
    color: #0a0056 !important;
    border-radius: 50px !important;
    padding: 8px 20px !important;
    margin: 10px 20px !important;
    width: auto !important;
    align-self: center;
  }

  .nav-links .but-link:hover {
    background-color: #0a0056 !important;
    color: white !important;
  }

}
.nav-link {
  font-family: "DM Sans", sans-serif;
  font-size: 16px;
  font-weight: 500;
  text-transform: none;
  color: #0a0056 !important; /* Set default color to match Farhadny title */
  background: transparent;
  border: none;
  margin: 0 10px;
}
.nav-link:hover {
  background-color:rgb(13, 2, 99); /* Lighter hover background for dark text */
  border-radius: 30px;
  color:rgb(123, 106, 255) !important; /* Ensure text stays dark */
}
.but-link{
  font-family: "DM Sans", sans-serif;
  font-size: 16px!important;
  font-weight: 500!important;
  background-color: transparent!important;
  border: 2px solid  #0a0056!important;
  color: #0a0056!important;
  border-radius: 50px!important;
  padding: 8px 20px!important;
  box-shadow: none!important;
  transition: 0.3s ease !important;
}
.but-link:hover{
  background-color: rgb(13, 2, 99) !important;
  color:rgb(123, 106, 255) !important;
}
.mat-mdc-icon-button .mdc-button__label, 
.mat-mdc-icon-button .mat-icon{
  color: #0a0056 !important;
}

  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false; 
  isAdminUser: boolean = false; 
  isSuperAdminUser: boolean = false;
  private authSubscription: Subscription | undefined;
  private roleSubscription: Subscription | undefined;
  menuOpen = false;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private snackBar: MatSnackBar
  ) { }

  toggleMenu(): void {
  this.menuOpen = !this.menuOpen;
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(status => {
      this.isLoggedIn = status;
      console.log('Authentication status updated in Header:', this.isLoggedIn); 
      this.updateUserRoles();
      });

    this.roleSubscription = this.authService.userRole$.subscribe(role => {
      this.updateUserRoles(); 
    });

    this.updateUserRoles();
  }

  private updateUserRoles(): void {
    this.isAdminUser = this.authService.isAdmin();
    this.isSuperAdminUser = this.authService.isSuperAdmin();
    console.log('HeaderComponent: isAdminUser:', this.isAdminUser, 'isSuperAdminUser:', this.isSuperAdminUser);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  

  onLogout(): void {
    this.authService.logout(); 
    this.router.navigate(['/login']); 
    this.snackBar.open('You have been logged out.', 'Close', { duration: 3000 }); 
  }


  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }
}
