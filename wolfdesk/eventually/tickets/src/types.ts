import { z } from "zod";
import * as commands from "./ticket.command.schemas";
import * as events from "./ticket.event.schemas";
import { Message, Ticket } from "./ticket.schemas";

export type Ticket = z.infer<typeof Ticket>;
export type Message = z.infer<typeof Message>;

export type TicketCommands = {
  OpenTicket: z.infer<typeof commands.OpenTicket>;
  CloseTicket: z.infer<typeof commands.CloseTicket>;
  AssignTicket: z.infer<typeof commands.AssignTicket>;
  AddMessage: z.infer<typeof commands.AddMessage>;
  RequestTicketEscalation: z.infer<typeof commands.RequestTicketEscalation>;
  EscalateTicket: z.infer<typeof commands.EscalateTicket>;
  ReassignTicket: z.infer<typeof commands.ReassignTicket>;
  MarkMessageDelivered: z.infer<typeof commands.MarkMessageDelivered>;
  AcknowledgeMessage: z.infer<typeof commands.AcknowledgeMessage>;
  MarkTicketResolved: z.infer<typeof commands.MarkTicketResolved>;
};

export type TicketEvents = {
  TicketOpened: z.infer<typeof events.TicketOpened>;
  TicketClosed: z.infer<typeof events.TicketClosed>;
  TicketAssigned: z.infer<typeof events.TicketAssigned>;
  MessageAdded: z.infer<typeof events.MessageAdded>;
  TicketEscalationRequested: z.infer<typeof events.TicketEscalationRequested>;
  TicketEscalated: z.infer<typeof events.TicketEscalated>;
  TicketReassigned: z.infer<typeof events.TicketReassigned>;
  MessageDelivered: z.infer<typeof events.MessageDelivered>;
  MessageRead: z.infer<typeof events.MessageRead>;
  TicketResolved: z.infer<typeof events.TicketResolved>;
};

export const schemas = {
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
    EscalationCronTriggered: events.EscalationCronTriggered,
    ReassignmentCronTriggered: events.ReassignmentCronTriggered,
    CheckInactiveTicketsCronTriggered: events.CheckInactiveTicketsCronTriggered,
  },
};
