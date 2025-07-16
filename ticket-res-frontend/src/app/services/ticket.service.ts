import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SeatInfo } from '../models/seat-info.model';

export interface TicketPurchaseRequestFrontend {
  eventId: number;
  quantity: number;
  seatInfo?: SeatInfo;
  totalAmount?: number;
}

export interface EventDTO {
  id?: string; 
  title: string;
  description: string;
  eventDateTime: string;
  location: string;
  price: number;
  imageUrl: string;
  categories: string[]; 
  totalTickets: number;
  ticketsSold: number;
}

export interface TicketDTO {
    id?: string;
    userId?: string;
    qrCode?: string;
    status?: string; 
    purchaseDateTime?: string;
    pricePaid?: number;
    seatInfo?: SeatInfo;
    event?: EventDTO;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:8081/api/tickets';

  constructor(private http: HttpClient) { }

  purchaseTickets(requestData: TicketPurchaseRequestFrontend): Observable<TicketDTO[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<TicketDTO[]>(`${this.apiUrl}/purchase`, requestData, { headers });
  }

  getUserTickets(): Observable<TicketDTO[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<TicketDTO[]>(`${this.apiUrl}/my-tickets`, { headers });
  }
}