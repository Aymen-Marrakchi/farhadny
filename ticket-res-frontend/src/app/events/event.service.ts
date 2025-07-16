import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AppEvent {
  id?: number; 
  title: string;
  description: string;
  eventDateTime: string; 
  location: string;
  categories: string[];
  imageUrl?: string;
  price: number;
  totalTickets: number;
  ticketsSold?: number;
  creatorId: number; 
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8081/api/events';

  constructor(private http: HttpClient) { }

  getAllEvents(): Observable<AppEvent[]> {
    return this.http.get<AppEvent[]>(this.apiUrl);
  }

  getEventsByCategories() {
    return this.http.get(this.apiUrl + '/category')
  }

  createEvent(event: AppEvent): Observable<AppEvent> {
    return this.http.post<AppEvent>(`${this.apiUrl}`, event);
  }

  updateEvent(id: number, event: AppEvent): Observable<AppEvent> {
    return this.http.put<AppEvent>(`${this.apiUrl}/${id}`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEventById(id: number): Observable<AppEvent> {
    return this.http.get<AppEvent>(`${this.apiUrl}/${id}`);
  }

  getTotalTicketsSoldAcrossAllEvents(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stats/total-tickets-sold/all`);
  }

  getTotalTicketsSoldForCreator(creatorId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stats/total-tickets-sold/by-creator/${creatorId}`);
  }
  getTotalRevenueForCreator(creatorId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stats/total-revenue/by-creator/${creatorId}`);
  }
}