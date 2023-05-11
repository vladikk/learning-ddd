import { ZodEmpty } from "@rotorsoft/eventually";
import { z } from "zod";
import * as commands from "./ticket.command.schemas";

export const TicketOpened = commands.OpenTicket.and(
  z.object({
    userId: z.string().uuid(),
    messageId: z.string().uuid(),
  })
).describe("A new ticket was opened");

export const TicketAssigned = commands.AssignTicket.describe(
  "An agent was assigned to the ticket"
);

export const MessageAdded = commands.AddMessage.and(
  z.object({
    from: z.string().uuid(),
    messageId: z.string().uuid(),
  })
).describe("A user added a message to the ticket");

export const TicketClosed = z
  .object({ closedById: z.string().uuid() })
  .describe("The ticket was closed");

export const TicketEscalationRequested = z
  .object({
    requestedById: z.string().uuid(),
    requestId: z.string().uuid(),
  })
  .describe("A ticket escalation was requested");

export const TicketEscalated = commands.EscalateTicket.and(
  z.object({
    escalationId: z.string().uuid(),
  })
).describe("The ticket was escalated");

export const TicketReassigned = commands.ReassignTicket.describe(
  "The ticket was reassigned"
);

export const MessageDelivered = commands.MarkMessageDelivered.describe(
  "The message was delivered to the recepient"
);

export const MessageRead = commands.AcknowledgeMessage.describe(
  "The message was acknoledged by the recipient"
);

export const TicketResolved = z
  .object({
    resolvedById: z.string().uuid(),
  })
  .describe("The ticket was marked as resolved");

export const EscalationCronTriggered = ZodEmpty.describe(
  "Ticket escalation cron triggered"
);
export const ReassignmentCronTriggered = ZodEmpty.describe(
  "Ticket reassignment cron triggered"
);
export const CheckInactiveTicketsCronTriggered = ZodEmpty.describe(
  "Ticket inactivity check cron triggered"
);
