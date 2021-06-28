import { Component, OnInit } from '@angular/core';
import { Ticket } from '../tickets';
import { TicketService } from '../tickets.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {

  public successMsg: string='';
  public errorMsg: string='';
  public date: string='';
  public name: string='';
  public email: string='';

  constructor(private ticketService: TicketService) { }

  ngOnInit(): void {
  }


  createTicket() {
    this.successMsg = '';
    this.errorMsg = '';
    this.ticketService.createTicket(this.date, this.name, this.email)
      .subscribe((createdTicket: Ticket) => {
        this.date = '';
        this.name = '';
        this.email = '';
        const date = new Date(createdTicket.date).toDateString();
        this.successMsg = `Ticket Booked Successfully!`;
      },
      (error: ErrorEvent) => {
        this.errorMsg = error.error.message;
      });
  }

}
