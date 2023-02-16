import { z } from "zod";
import { Attachment, Priority } from "./ticket.schemas";

export const OpenTicket = z
  .object({
    ticketId: z.string().uuid(),
    productId: z.string().uuid(),
    supportCategoryId: z.string().uuid(),
    priority: z.nativeEnum(Priority),
    userId: z.string().uuid(),
    title: z.string().min(1),
    message: z.string().min(1),
  })
  .describe("Opens a new ticket");

export const AssignTicket = z.object({
  ticketId: z.string().uuid(),
  agentId: z.string().uuid(),
});

export const AddMessage = z.object({
  ticketId: z.string().uuid(),
  from: z.string().uuid(),
  to: z.string().uuid(),
  body: z.string().min(1),
  attachments: z.record(z.string().url(), Attachment),
});

export const CloseTicket = z.object({
  ticketId: z.string().uuid(),
  closedById: z.string().uuid(),
});

export const RequestTicketEscalation = z.object({
  ticketId: z.string().uuid(),
  requestedBy: z.string().uuid(),
});

export const EscalateTicket = z.object({
  requestId: z.string().uuid(),
  ticketId: z.string().uuid(),
  requestedBy: z.string().uuid(),
});

export const ReassignTicket = z.object({
  ticketId: z.string().uuid(),
  agentId: z.string().uuid(),
});

export const MarkMessageDelivered = z.object({
  ticketId: z.string().uuid(),
  messageId: z.string().uuid(),
});

export const AcknowledgeMessage = z.object({
  ticketId: z.string().uuid(),
  messageId: z.string().uuid(),
});

export const MarkTicketResolved = z.object({
  ticketId: z.string().uuid(),
  resolvedBy: z.string().uuid(),
});
