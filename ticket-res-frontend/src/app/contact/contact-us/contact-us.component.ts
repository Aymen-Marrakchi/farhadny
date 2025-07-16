import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactComponent {
  contactData = {
    email: '',
    phonenumber: '',
    message: ''
  };

  constructor(private contactService: ContactService, private snackBar: MatSnackBar) {}

  onSubmit() {
    this.contactService.sendContactMessage(this.contactData).subscribe({
      next: () => {
        this.snackBar.open('Message sent successfully!', 'Close', { duration: 3000 });
        this.contactData = { email: '', phonenumber: '', message: '' };
      },
      error: () => {
        this.snackBar.open('Failed to send message.', 'Close', { duration: 3000 });
      }
    });
  }
}