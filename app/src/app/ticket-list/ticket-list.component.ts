import { Component, OnInit } from '@angular/core';
import { Ticket } from '../tickets';
import { TicketService } from '../tickets.service';
import { mergeMap } from 'rxjs/operators';
@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {
  public loading = true;
  public errorMsg: string = "";
  public successMsg: string  = "";
  public tickets: Ticket[]  = [];
  public columns = ['date', 'name', 'email', 'cancel'];
  
  constructor(private ticketService: TicketService) { }

  ngOnInit(): void {

    this.ticketService.getTickets()
      .subscribe((tickets: Ticket[]) => {
        this.tickets = tickets;
        this.loading = false;
  },
    
  (error: ErrorEvent) => {
    this.errorMsg = error.error.message;
    this.loading = false;
  });
}
cancelTicket(id: string) {
  this.ticketService.cancelTicket(id)
    .pipe(
      mergeMap(() => this.ticketService.getTickets())
    )
    .subscribe((tickets: Ticket[]) => {
      this.tickets = tickets;
      this.successMsg = 'Successfully cancelled ticket';
    },
    (error: ErrorEvent) => {
      this.errorMsg = error.error.message;
    });
}

}