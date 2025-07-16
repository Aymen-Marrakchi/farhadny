import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

// Make sure these imports are correct based on your file structure
import { TicketService, TicketPurchaseRequestFrontend, TicketDTO } from '../services/ticket.service';
import { SeatInfo } from '../models/seat-info.model'; // Make sure this is created and imported

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.scss']
})
export class TicketFormComponent implements OnInit {
  // --- CHANGE MADE HERE ---
  @Input() eventId: number | undefined;
  @Input() eventPrice: number | undefined;

  quantity: number = 1;
  totalPrice: number = 0;
  selectedSeatInfo: SeatInfo | null = null;
  seatInfoOptions = Object.values(SeatInfo);

  constructor(
    private ticketService: TicketService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.calculateTotalPrice();
  }

  onQuantityChange(): void {
    if (this.quantity < 1) {
      this.quantity = 1;
    }
    this.calculateTotalPrice();
  }

  calculateTotalPrice(): void {
    if (this.eventPrice) {
      this.totalPrice = this.quantity * this.eventPrice;
    }
  }

  onSubmit(): void {
    // Note: The eventId in requestPayload will now be a string, matching your backend DTO
    if (!this.eventId || this.quantity <= 0) {
      this.snackBar.open('Event ID and a valid quantity are required.', 'Close', { duration: 3000 });
      return;
    }

    const requestPayload: TicketPurchaseRequestFrontend = {
      eventId: this.eventId, // This is now correctly a string
      quantity: this.quantity,
      seatInfo: this.selectedSeatInfo || undefined,
      totalAmount: this.totalPrice
    };

    console.log('Sending ticket purchase request:', requestPayload);

    this.ticketService.purchaseTickets(requestPayload).subscribe({
      next: (response: TicketDTO[]) => {
        this.snackBar.open(`${response.length} ticket(s) purchased successfully!`, 'Close', { duration: 5000 });
        console.log('Purchase successful:', response);
        this.router.navigate(['/my-orders']);
      },
      error: (error) => {
        let errorMessage = 'Failed to purchase tickets. Please try again.';
        if (error.error) {
          if (error.error.message) {
            errorMessage = error.error.message;
          } else if (typeof error.error === 'string') {
            errorMessage = error.error;
          }
        }
        this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        console.error('Ticket purchase error:', error);
      }
    });
  }
}