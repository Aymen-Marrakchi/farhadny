import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminStats } from '../models/admin-stats.model'; 

@Injectable({
  providedIn: 'root'
})
export class AdminStatsService {
  private apiUrl = 'http://localhost:8081/api/admin-stats';

  constructor(private http: HttpClient) { }

  getAllAdminStatistics(): Observable<AdminStats[]> {
    return this.http.get<AdminStats[]>(this.apiUrl);
  }
  
  updateAdminPercentage(userId: number, newPercentage: number | null): Observable<AdminStats> {
    return this.http.put<AdminStats>(`${this.apiUrl}/${userId}/percentage?newPercentage=${newPercentage}`, {});
  }
}