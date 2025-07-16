import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { EventService, AppEvent } from '../../events/event.service';
import { UserService, AppUser, UserRole } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';


import { ContactService } from '../../services/contact.service';
import { ContactResponse } from '../../models/contact-response.model';
import { HttpErrorResponse } from '@angular/common/http'; 
import { AdminStats } from '../../models/admin-stats.model';
import { AdminStatsService } from '../../services/admin-stats.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    FormsModule
  ],
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  events: AppEvent[] = [];
  editingEventForm: any = null;
  totalTicketsSold: number | null = null;
  isLoadingStats: boolean = true;
  statsErrorMessage: string | null = null;
  searchTerm: string = '';

  users: AppUser[] = [];
  editingUserForm: any = null;
  userRoles: UserRole[] = Object.values(UserRole);
  isSuperAdmin: boolean = false;
  currentUserId: number | null = null;

  contactMessages: ContactResponse[] = [];
  loadingContactMessages: boolean = true;
  contactMessagesError: string | null = null;

  adminStatistics: AdminStats[] = [];
  loadingAdminStatistics: boolean = true;
  adminStatsErrorMessage: string | null = null;
  editingPercentageUserId: number | null = null;
  newPercentageValue: number | null = null;

  totalRevenueByCreator: number | null = null;
  isLoadingRevenue: boolean = false;
  revenueErrorMessage: string | null = null;

  currentView: 'events' | 'users' | 'contact-messages' = 'events';

  constructor(
    private eventService: EventService,
    private userService: UserService,
    private authService: AuthService,
    private contactService: ContactService, 
    private adminStatsService: AdminStatsService
  ) { }

  ngOnInit() {
    this.checkUserRole();
    this.loadEvents();
    this.loadTotalTicketsSold();
    this.loadUsers();
    this.loadContactMessages();
    this.loadAdminStatistics();
  }

  get filteredEvents(): AppEvent[] {
    if (!this.searchTerm) {
      return this.events;
    }
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    return this.events.filter(event =>
      event.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      event.description.toLowerCase().includes(lowerCaseSearchTerm) ||
      event.location.toLowerCase().includes(lowerCaseSearchTerm) ||
      event.categories.some(category => category.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }

  switchView(view: 'events' | 'users' | 'contact-messages'): void {
    this.currentView = view;
    this.editingEventForm = null;
    this.editingUserForm = null;
    if (view === 'events') {
      this.loadEvents();
    } else if (view === 'users') {
      this.loadUsers();
    } else if (view === 'contact-messages') {
      this.loadContactMessages();
    }
  }

  checkUserRole(): void {
    const userRoles = this.authService.getCurrentUserRole();
    this.currentUserId = this.authService.getUserId() || null;

    if (userRoles && userRoles.includes(UserRole.SUPER_ADMIN)) {
      this.isSuperAdmin = true;
    } else {
      this.isSuperAdmin = false;
    }
    console.log('Is Super Admin:', this.isSuperAdmin);
    console.log('Current User ID:', this.currentUserId);
  }

  loadEvents() {
    if (this.currentUserId !== null) {
      this.eventService.getAllEvents().subscribe(
        data => {
          if (this.isSuperAdmin) {
            this.events = data;
            console.log('SUPER_ADMIN: All events loaded:', this.events);
          } else {
            this.events = data.filter(event => event.creatorId === this.currentUserId);
            console.log('ADMIN: Events loaded for current user (creatorId match):', this.events);
          }

          if (this.events.length === 0 && data.length > 0) {
            console.warn('Dashboard shows no events, but backend returned some data.');
            console.log('Full data from backend:', data);
            console.log('Is Super Admin:', this.isSuperAdmin);
            console.log('Current User ID (from authService):', this.currentUserId);
            data.slice(0, 5).forEach(event => {
              console.log(`- Event ID: ${event.id}, Title: ${event.title}, Creator ID: '${event.creatorId}'`);
            });
          }
        },
        error => console.error('Error loading events:', error)
      );
    } else {
      console.warn("Current user ID not available. Cannot load specific events.");
      this.events = [];
    }
  }

  loadTotalTicketsSold(): void {
    this.isLoadingStats = true;
    this.statsErrorMessage = null;

    if (this.isSuperAdmin) {
      this.eventService.getTotalTicketsSoldAcrossAllEvents().subscribe({
        next: (total: number) => {
          this.totalTicketsSold = total;
          this.isLoadingStats = false;
          console.log('SUPER_ADMIN: Total tickets sold (all events):', this.totalTicketsSold);
        },
        error: (err) => {
          console.error('Error fetching total tickets sold (all events):', err);
          this.isLoadingStats = false;
          this.handleStatsError(err);
        }
      });
    } else if (this.currentUserId !== null) {
      this.eventService.getTotalTicketsSoldForCreator(this.currentUserId).subscribe({
        next: (total: number) => {
          this.totalTicketsSold = total;
          this.isLoadingStats = false;
          console.log('ADMIN: Total tickets sold (for own events):', this.totalTicketsSold);
        },
        error: (err) => {
          console.error('Error fetching total tickets sold (for own events):', err);
          this.isLoadingStats = false;
          this.handleStatsError(err);
        }
      });
    } else {
      console.warn("Cannot load total tickets sold: User ID not available.");
      this.isLoadingStats = false;
      this.statsErrorMessage = "Cannot load statistics: User not identified.";
    }
  }

   loadTotalRevenueForLoggedInCreator(creatorId: number): void {
    this.isLoadingRevenue = true;
    this.revenueErrorMessage = null;
    this.eventService.getTotalRevenueForCreator(creatorId).subscribe({
      next: (revenue: number) => {
        this.totalRevenueByCreator = revenue;
        this.isLoadingRevenue = false;
        console.log(`Revenue for creator ${creatorId}:`, this.totalRevenueByCreator);
      },
      error: (err: HttpErrorResponse) => {
        console.error(`Error fetching total revenue for creator ${creatorId}:`, err);
        this.revenueErrorMessage = 'Failed to load your total revenue.';
        this.isLoadingRevenue = false;
        if (err.status === 403) {
            this.revenueErrorMessage = 'Access Denied: You do not have permission to view your revenue statistics.';
        } else if (err.status === 401) {
            this.revenueErrorMessage = 'Unauthorized: Please log in.';
        }
      }
    });
  }

  private handleStatsError(err: any): void {
    if (err.status === 403) {
      this.statsErrorMessage = 'Access Denied: You do not have permission to view these statistics.';
    } else if (err.status === 401) {
      this.statsErrorMessage = 'Unauthorized: Please log in.';
    } else {
      this.statsErrorMessage = 'Failed to load total tickets sold. Please try again.';
    }
  }

  addNewEvent() {
    this.editingEventForm = {
      id: null,
      title: '',
      description: '',
      eventDateTime: '',
      location: '',
      price: null,
      imageUrl: '',
      categories: [],
      totalTickets: 1,
      creatorId: this.currentUserId
    };
  }

  editEvent(event: AppEvent) {
    this.editingEventForm = {
      ...event,
      categories: event.categories ? event.categories.join(', ') : ''
    };
  }
  cancelEdit() {
    this.editingEventForm = null;
  }

  onSubmit() {
    if (!this.editingEventForm) {
      console.warn('Form submitted but no event data to process.');
      return;
    }

    const categoriesString = typeof this.editingEventForm.categories === 'string'
      ? this.editingEventForm.categories
      : '';
    const eventToSubmit: AppEvent = {
      ...this.editingEventForm,
      price: Number(this.editingEventForm.price),
      categories: this.editingEventForm.categories
        .split(',')
        .map((cat: string) => cat.trim())
        .filter((cat: string) => cat.length > 0),
      totalTickets: Number(this.editingEventForm.totalTickets) || 1,
      creatorId: this.editingEventForm.creatorId !== null && this.editingEventForm.creatorId !== undefined? Number(this.editingEventForm.creatorId): (this.currentUserId !== null ? this.currentUserId : 0)
    };

    if (eventToSubmit.creatorId === null || eventToSubmit.creatorId === undefined) {
        alert("Cannot save event: Creator ID is missing.");
        return;
    }

    if (isNaN(eventToSubmit.totalTickets) || eventToSubmit.totalTickets < 1) {
      alert('Please enter a valid number for Total Tickets (at least 1).');
      return;
    }

    if (eventToSubmit.id) { 
      if (eventToSubmit.id === null) {
        console.error('Attempted to update event without an ID.');
        return;
      }
      this.eventService.updateEvent(eventToSubmit.id, eventToSubmit).subscribe(
        () => {
          this.loadEvents();
          this.cancelEdit();
        },
        error => console.error('Error updating event:', error)
      );
    } else {
      if (this.currentUserId === null) {
        alert("Cannot create event: User ID not available.");
        console.error("Attempted to create event without a current user ID.");
        return;
      }
      eventToSubmit.creatorId = this.currentUserId;
      this.eventService.createEvent(eventToSubmit).subscribe(
        () => {
          this.loadEvents();
          this.cancelEdit();
        },
        error => console.error('Error creating event:', error)
      );
    }
  }

  deleteEvent(id: number) {
    if (id === undefined || id === null) { 
      console.error('Attempted to delete event with undefined/null ID.');
      return;
    }
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      this.eventService.deleteEvent(id).subscribe(
        () => this.loadEvents(),
        error => console.error('Error deleting event:', error)
      );
    }
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: AppUser[]) => {
        this.users = data;
        console.log('Loaded users:', this.users);
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }

  addNewUser(): void {
    this.editingUserForm = {
      id: null,
      username: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: UserRole.ADMIN
    };
  }

  editUser(user: AppUser): void {
    this.editingUserForm = { ...user };
    this.editingUserForm.password = '';
  }

  cancelEditUser(): void {
    this.editingUserForm = null;
  }

  onSubmitUserForm(): void {
    if (!this.editingUserForm) {
      console.warn('User form submitted but no user data to process.');
      return;
    }

    const userToSubmit: AppUser = { ...this.editingUserForm };

    if (!userToSubmit.id && (!userToSubmit.password || userToSubmit.password.length < 6)) {
      alert('Password is required and must be at least 6 characters for new users.');
      return;
    }

    if (userToSubmit.id === this.currentUserId && this.isSuperAdmin && userToSubmit.role !== UserRole.SUPER_ADMIN) {
      alert("You cannot change your own role to something other than SUPER_ADMIN.");
      return;
    }

    if (userToSubmit.id) { 
      if (userToSubmit.id === null) {
        console.error('Attempted to update user without an ID.');
        return;
      }
      if (this.isSuperAdmin && userToSubmit.role !== this.users.find(u => u.id === userToSubmit.id)?.role) {
        this.userService.updateUserRole(userToSubmit.id, userToSubmit.role).subscribe({
          next: () => {
            this.loadUsers();
            this.cancelEditUser();
            alert('User role updated successfully!');
          },
          error: (err) => console.error('Error updating user role:', err)
        });
      } else {
        this.userService.updateUser(userToSubmit.id, userToSubmit).subscribe({
          next: () => {
            this.loadUsers();
            this.cancelEditUser();
            alert('User updated successfully!');
          },
          error: (err) => console.error('Error updating user:', err)
        });
      }
    } else {
      this.userService.createAdminUser(userToSubmit).subscribe({
        next: () => {
          this.loadUsers();
          this.cancelEditUser();
          alert('New admin user created successfully!');
        },
        error: (err) => {
          console.error('Error creating admin user:', err);
          if (err.status === 400 && err.error && err.error.message) {
            alert('Error creating user: ' + err.error.message);
          } else {
            alert('Failed to create user. Check console for details.');
          }
        }
      });
    }
  }

  updateUserRoleDirectly(user: AppUser, newRole: UserRole): void {
    if (user.id === this.currentUserId && user.id !== null) {
      alert("You cannot change your own role or modify your own account's role via this action.");
      const originalUser = this.users.find(u => u.id === user.id);
      if (originalUser) {
        user.role = originalUser.role;
      }
      return;
    }

    if (confirm(`Are you sure you want to change ${user.username}'s role to ${newRole}?`)) {
      this.userService.updateUserRole(user.id!, newRole).subscribe({
        next: () => {
          this.loadUsers();
          alert(`Role for ${user.username} updated to ${newRole}.`);
        },
        error: (err) => {
          console.error('Error updating user role:', err);
          alert('Failed to update user role. Check console for details.');
        }
      });
    } else {
      const originalUser = this.users.find(u => u.id === user.id);
      if (originalUser) {
        user.role = originalUser.role;
      }
    }
  }

  deleteUser(id: number | undefined): void {
    if (id === undefined || id === null) {
      console.error('Attempted to delete user with undefined/null ID.');
      return;
    }

    if (id === this.currentUserId && this.isSuperAdmin) {
      alert("You cannot delete your own account.");
      return;
    }

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.loadUsers();
        alert('User deleted successfully!');
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        if (err.status === 403) {
          alert('Access Denied: You do not have permission to delete users.');
        } else {
          alert('Failed to delete user. Check console for details.');
        }
      }
    });
  }


  loadContactMessages(): void {
    this.loadingContactMessages = true;
    this.contactMessagesError = null;
    this.contactService.getAllContactResponses().subscribe({
      next: (data: ContactResponse[]) => {
        this.contactMessages = data;
        this.loadingContactMessages = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching contact messages:', err);
        this.contactMessagesError = `Failed to load messages. Status: ${err.status} ${err.statusText || ''}`;
        if (err.status === 403 || err.status === 401) {
          this.contactMessagesError += '. Authentication required or forbidden.';
        }
        this.loadingContactMessages = false;
      }
    });
  }

  markContactMessageAsReplied(id: number): void {
    if (confirm('Are you sure you want to mark this message as replied?')) {
      this.contactService.markContactMessageAsReplied(id).subscribe({
        next: (updatedMessage: ContactResponse) => {
          const index = this.contactMessages.findIndex(msg => msg.id === id);
          if (index !== -1) {
            this.contactMessages[index] = updatedMessage;
          }
          alert('Message marked as replied!');
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error marking message as replied:', err);
          alert(`Failed to mark message as replied. Error: ${err.statusText || 'Unknown error'}`);
        }
      });
    }
  }

  deleteContactMessage(id: number): void {
    if (confirm('Are you sure you want to delete this message permanently?')) {
      this.contactService.deleteContactResponse(id).subscribe({
        next: () => {
          this.contactMessages = this.contactMessages.filter(msg => msg.id !== id);
          alert('Message deleted successfully!');
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error deleting message:', err);
          alert(`Failed to delete message. Error: ${err.statusText || 'Unknown error'}`);
        }
      });
    }
  }
  
  loadAdminStatistics(): void {
    this.loadingAdminStatistics = true;
    this.adminStatsErrorMessage = null;
    this.adminStatsService.getAllAdminStatistics().subscribe({
      next: (data: AdminStats[]) => {
        this.adminStatistics = data;
        this.loadingAdminStatistics = false;
        console.log('Admin Statistics loaded:', this.adminStatistics);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching admin statistics:', err);
        this.adminStatsErrorMessage = `Failed to load admin statistics. Status: ${err.status} ${err.statusText || ''}`;
        if (err.status === 403 || err.status === 401) {
          this.adminStatsErrorMessage += '. You do not have permission to view admin statistics.';
        }
        this.loadingAdminStatistics = false;
      }
    });
  }

  savePercentageDirectly(adminStat: AdminStats): void {
    const percentageToSave = adminStat.percentage === null || adminStat.percentage === undefined || (typeof adminStat.percentage === 'string' && adminStat.percentage === '')? null: Number(adminStat.percentage);

    if (percentageToSave !== null && (isNaN(percentageToSave) || percentageToSave < 0 || percentageToSave > 100)) {
        alert('Please enter a valid percentage between 0 and 100, or leave it empty for null.');
        this.loadAdminStatistics();
        return;
    }

    if (adminStat.id === null || adminStat.id === undefined) {
      console.error('Cannot save percentage: AdminStat ID is missing.');
      alert('Error: Cannot save percentage. Admin ID missing.');
      return;
    }

    this.adminStatsService.updateAdminPercentage(adminStat.id, percentageToSave).subscribe({
      next: (updatedStat: AdminStats) => {
        console.log('Percentage updated successfully for user:', updatedStat.email);
        const index = this.adminStatistics.findIndex(s => s.id === updatedStat.id);
        if (index !== -1) {
          this.adminStatistics[index] = updatedStat;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating percentage:', err);
        alert(`Failed to update percentage. Error: ${err.statusText || 'Unknown error'}`);
        this.loadAdminStatistics();
      }
    });
  }
}