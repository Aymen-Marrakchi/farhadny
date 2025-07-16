import { Routes } from '@angular/router';
import { EventsListComponent } from './events/events-list/events-list.component'; 
import { LoginComponent } from './auth/login/login.component'; 
import { RegisterComponent } from './auth/register/register.component'; 
import { ContactComponent } from './contact/contact-us/contact-us.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { EventDetailsComponent } from './events/event-details/event-details.component'
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { MyOrdersComponent } from './my-orders/my-orders/my-orders.component';

export const routes: Routes = [
  { path: '', component: EventsListComponent }, 
  { path: 'contact', component: ContactComponent  },
  { path: 'login', component: LoginComponent },   
  { path: 'register', component: RegisterComponent }, 
  { path: 'my-orders', component: MyOrdersComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: AdminDashboardComponent, canActivate: [ AdminGuard ],data: {
  roles: ['ADMIN', 'SUPER_ADMIN'] 
} },
  { path: 'events/:id', component: EventDetailsComponent }

];
