import * as commands from "./ticket.command.schemas";
import * as events from "./ticket.event.schemas";

export const AssignmentSchemas = {
  events: { TicketOpened: events.TicketOpened },
  commands: { AssignTicket: commands.AssignTicket },
};

export const AutomaticEscalationSchemas = {
  events: { EscalationCronTriggered: events.EscalationCronTriggered },
  commands: { EscalateTicket: commands.EscalateTicket },
};

export const ClosingSchemas = {
  events: {
    CheckInactiveTicketsCronTriggered: events.CheckInactiveTicketsCronTriggered,
  },
  commands: { CloseTicket: commands.CloseTicket },
};

export const DeliverySchemas = {
  events: { MessageAdded: events.MessageAdded },
  commands: { MarkMessageDelivered: commands.MarkMessageDelivered },
};

export const ReassingmentSchemas = {
  events: { ReassignmentCronTriggered: events.ReassignmentCronTriggered },
  commands: { ReassignTicket: commands.ReassignTicket },
};

export const RequestedEscalationSchemas = {
  events: { TicketEscalationRequested: events.TicketEscalationRequested },
  commands: { EscalateTicket: commands.EscalateTicket },
};
