import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ticket } from './tickets';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
    
  private BASE_URL = environment.API_URL;

  constructor(private http: HttpClient) { }

  getTickets(): Observable<Ticket[]>{
    return this.http.get<Ticket[]>(`${this.BASE_URL}/tickets`)
  }

  createTicket( date: string, name: string, email: string): Observable<Ticket>{
    return this.http.post<Ticket>(`${this.BASE_URL}/tickets`,
    {date, name, email});
  
}

 cancelTicket(id: string): Observable<any> {
  return this.http.delete<Ticket[]>(`${this.BASE_URL}/tickets/${id}`);


 }
}
