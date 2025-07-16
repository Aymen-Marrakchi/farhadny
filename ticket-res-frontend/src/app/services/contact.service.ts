import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactResponse } from '../models/contact-response.model';


@Injectable({ providedIn: 'root' })
export class ContactService {
  private contactApiUrl = 'http://localhost:8081/api/contact';

  constructor(private http: HttpClient ) {} 

  sendContactMessage(messageData: { email: string; phonenumber: string; message: string }): Observable<any> {
    return this.http.post<any>(`${this.contactApiUrl}`, messageData);
  }

  getAllContactResponses(): Observable<ContactResponse[]> {
    return this.http.get<ContactResponse[]>(this.contactApiUrl);
  }

  getContactResponseById(id: number): Observable<ContactResponse> {
    return this.http.get<ContactResponse>(`${this.contactApiUrl}/${id}`);
  }

  markContactMessageAsReplied(id: number): Observable<ContactResponse> {
    return this.http.put<ContactResponse>(`${this.contactApiUrl}/${id}/mark-replied`, {});
  }

  deleteContactResponse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.contactApiUrl}/${id}`);
  }
}