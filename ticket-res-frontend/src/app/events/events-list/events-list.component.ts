import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { EventCardComponent } from '../event-card/event-card.component';
import { EventService, AppEvent } from '../event.service';
import { CommonModule } from '@angular/common';

interface EventsByCategory {
  categoryName: string;
  events: AppEvent[];
}

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    EventCardComponent,
    CommonModule
  ],
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = '';
  events: AppEvent[] = [];
  allCategories: string[] = [];
  filteredEventsByCategories: EventsByCategory[] = [];

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.extractAllCategories();
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error fetching events:', error);
      }
    });
  }

  private extractAllCategories(): void {
    const categorySet = new Set<string>();
    this.events.forEach(event => {
      if (event.categories && Array.isArray(event.categories)) {
        event.categories.forEach(cat => {
          if (cat.trim()) {
            categorySet.add(cat.trim());
          }
        });
      }
    });
    this.allCategories = Array.from(categorySet).sort();
  }

  applyFilters(): void {
    let filtered = this.events;

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        (event.title?.toLowerCase().includes(term) || event.description?.toLowerCase().includes(term))
      );
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(event =>
        event.categories?.some(cat => cat.trim() === this.selectedCategory)
      );
    }

    this.groupEventsByCategories(filtered);
  }

  private groupEventsByCategories(events: AppEvent[]): void {
    const categoryMap = new Map<string, AppEvent[]>();

    events.forEach(event => {
      if (event.categories && Array.isArray(event.categories) && event.categories.length > 0) {
        event.categories.forEach(category => {
          const categoryName = category.trim();
          if (categoryName) {
            if (!categoryMap.has(categoryName)) {
              categoryMap.set(categoryName, []);
            }
            categoryMap.get(categoryName)?.push(event);
          }
        });
      }
    });

    this.filteredEventsByCategories = Array.from(categoryMap.entries()).map(([categoryName, events]) => ({
      categoryName,
      events
    }));

    this.filteredEventsByCategories.sort((a, b) => a.categoryName.localeCompare(b.categoryName));
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }
}