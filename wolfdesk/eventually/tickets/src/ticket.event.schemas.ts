import { ZodEmpty } from "@rotorsoft/eventually";
import { z } from "zod";
import * as commands from "./ticket.command.schemas";

export const TicketOpened = commands.OpenTicket.and(
  z.object({ messageId: z.string().uuid() })
).describe("A new ticket was opened");
export const TicketAssigned = commands.AssignTicket;
export const MessageAdded = commands.AddMessage.and(
  z.object({ messageId: z.string().uuid() })
);
export const TicketClosed = commands.CloseTicket;
export const TicketEscalationRequested = commands.RequestTicketEscalation.and(
  z.object({
    requestId: z.string().uuid(),
  })
);
export const TicketEscalated = commands.EscalateTicket.and(
  z.object({
    escalationId: z.string().uuid(),
  })
);
export const TicketReassigned = commands.ReassignTicket;
export const MessageDelivered = commands.MarkMessageDelivered;
export const MessageRead = commands.AcknowledgeMessage;
export const TicketResolved = commands.MarkTicketResolved;
export const EscalationCronTriggered = ZodEmpty;
export const ReassignmentCronTriggered = ZodEmpty;
export const CheckInactiveTicketsCronTriggered = ZodEmpty;
