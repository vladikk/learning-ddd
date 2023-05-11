import { Ticket } from "./schemas";
import * as commands from "./ticket.command.schemas";
import * as events from "./ticket.event.schemas";

export const TicketSchemas = {
  state: Ticket,
  commands: {
    OpenTicket: commands.OpenTicket,
    CloseTicket: commands.CloseTicket,
    AssignTicket: commands.AssignTicket,
    AddMessage: commands.AddMessage,
    RequestTicketEscalation: commands.RequestTicketEscalation,
    EscalateTicket: commands.EscalateTicket,
    ReassignTicket: commands.ReassignTicket,
    MarkMessageDelivered: commands.MarkMessageDelivered,
    AcknowledgeMessage: commands.AcknowledgeMessage,
    MarkTicketResolved: commands.MarkTicketResolved,
  },
  events: {
    TicketOpened: events.TicketOpened,
    TicketClosed: events.TicketClosed,
    TicketAssigned: events.TicketAssigned,
    MessageAdded: events.MessageAdded,
    TicketEscalationRequested: events.TicketEscalationRequested,
    TicketEscalated: events.TicketEscalated,
    TicketReassigned: events.TicketReassigned,
    MessageDelivered: events.MessageDelivered,
    MessageRead: events.MessageRead,
    TicketResolved: events.TicketResolved,
  },
};
