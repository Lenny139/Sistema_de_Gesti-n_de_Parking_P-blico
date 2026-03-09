import AbstractTicket, { TicketInterface } from './AbstractTicket.js'

export default class Ticket extends AbstractTicket {
  constructor(ticket: TicketInterface) {
    super(ticket)
  }
}
