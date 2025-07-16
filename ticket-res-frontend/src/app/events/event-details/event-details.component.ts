import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, AppEvent } from '../../events/event.service';
import { TicketFormComponent } from '../../ticket-form/ticket-form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ShareButtonsComponent } from '../../share/share-buttons/share-buttons.component';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    CommonModule,
    TicketFormComponent,
    MatProgressSpinnerModule,
    ShareButtonsComponent
  ],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  event: AppEvent | undefined;
  isLoading: boolean = true;
  errorMessage: string | null = null;
  currentEventUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const eventIdString = params.get('id');

      if (eventIdString) {
        const eventId = Number(eventIdString);

        if (isNaN(eventId)) {
            this.errorMessage = 'Invalid Event ID provided.';
            this.isLoading = false;
            return; 
        }

        this.fetchEventDetails(eventId);
      } else {
        this.errorMessage = 'Event ID not provided.';
        this.isLoading = false;
      }
    });
  }

  fetchEventDetails(id: number): void {
    this.isLoading = true;
    this.eventService.getEventById(id).subscribe({ 
      next: (data: AppEvent) => {
        this.event = data;
        this.isLoading = false;
        console.log('Fetched event:', this.event);
        this.currentEventUrl = window.location.origin + this.router.url;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load event details.';
        console.error('Error fetching event details:', error);
        this.isLoading = false;
      }
    });
  }
}