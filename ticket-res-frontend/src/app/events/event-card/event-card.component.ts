import { Component, Input} from '@angular/core';
import { MatCardModule } from '@angular/material/card';   // For the card itself
import { MatButtonModule } from '@angular/material/button'; // For buttons on the card
import { MatIconModule } from '@angular/material/icon';     // For icons (e.g., date, location)
import { CommonModule } from '@angular/common';
import { AppEvent } from '../event.service';
import { RouterModule } from '@angular/router';




@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    RouterModule
  ],
  template: `
    <mat-card class="event-card">
      <div class="image-wrapper">
        <img [src]="event.imageUrl || '/event.jpg'" alt="{{ event.title }}">
      </div>
      <div class="event-content">
        <h3 class="event-title">{{ event.title }}</h3>
        
        <p class="event-details date-details">
          <span>{{ event.eventDateTime | date:'mediumDate' }}</span>
          <mat-icon svgIcon="calendar_today_icon"></mat-icon> </p>
        <p class="event-details location-details">
          <span>{{ event.location }}</span>
          <mat-icon svgIcon="location_on_icon"></mat-icon> </p>
        
        <p class="event-price">{{ event.price | currency:'TND':'symbol':'1.2-2' }}</p>
      </div>
      <div class="card-actions">
        <button mat-flat-button color="accent" [routerLink]="['/events', event.id]">Buy Tickets</button>
        <button mat-icon-button aria-label="Add to favorites">
          <mat-icon>favorite_border</mat-icon>
        </button>
      </div>
    </mat-card>
  `,
  styles: [`
    .event-card {
      display: flex;
      flex-direction: column;
      background: #fff;
      color: #333;
      border-radius: 20px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      width: 360px;
      height: 460px; 

      &:hover {
        transform: translateY(-6px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
      }

      .image-wrapper {
        width: 100%;
        height: 220px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        &:hover img {
          transform: scale(1.05);
        }
      }

      .event-content {
        padding: 0px 20px 0px;

        .event-title {
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 12px;
          color: #1c1c1c;
        }

        .event-details {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.95rem;
          color: #666;
          margin-bottom: 8px;

          span {
            margin-right: auto;
          }

          mat-icon {
            color: #999;
          }
        }

        .event-price {
          font-size: 1.3rem;
          font-weight: 600;
          color: #f5167e;
          margin-top: 12px;
        }
      }

      .card-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-top: 1px solid #eee;
        background-color: #fafafa;

        button[mat-flat-button] {
          background-color: #f5167e;
          color: #fff;
          font-weight: 600;
          border-radius: 8px;
          padding: 10px 20px;
          text-transform: none;

          &:hover {
            background-color: #d80d69;
          }
        }

        button[mat-icon-button] {
          color: #ccc;

          &:hover {
            color: #f5167e;
            transform: scale(1.1);
          }
        }
      }
    }
  `]
})
export class EventCardComponent {
  @Input() event!: AppEvent;
  
}

