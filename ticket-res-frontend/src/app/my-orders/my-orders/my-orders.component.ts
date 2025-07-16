import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { TicketDTO, TicketService } from '../../services/ticket.service'; 
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, QRCodeComponent], 
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})
export class MyOrdersComponent implements OnInit { 
  userTickets: TicketDTO[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private ticketService: TicketService) {
    console.log('MyOrdersComponent: Constructor called');
   } 

  ngOnInit(): void {
    console.log('MyOrdersComponent: ngOnInit called');
    this.loadMyTickets();
  }

  loadMyTickets(): void {
    console.log('MyOrdersComponent: loadMyTickets called, attempting API call.');
    this.isLoading = true;
    this.ticketService.getUserTickets().subscribe({
      next: (tickets) => {
        console.log('MyOrdersComponent: Tickets received (inside subscribe next):', tickets);
        this.userTickets = tickets;
        this.isLoading = false;
        if (tickets.length === 0) {
          this.errorMessage = 'You have no purchased tickets yet.';
        }
      },
      error: (error) => {
        console.error('Error loading user tickets:', error);
        this.errorMessage = 'Failed to load your tickets. Please try again later.';
        this.isLoading = false;
      }
    });
    console.log('MyOrdersComponent: getUserTickets subscription initiated (after call).');
  }

  // Helper to format date if needed
  formatDateTime(dateTimeString: string | undefined): string {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString(); 
  }
}