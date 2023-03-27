import { ZodEmpty } from "@rotorsoft/eventually";
import { z } from "zod";
import { Attachment, Priority } from "./ticket.schemas";

export const OpenTicket = z
  .object({
    productId: z.string().uuid(),
    supportCategoryId: z.string().uuid(),
    priority: z.nativeEnum(Priority),
    title: z.string().min(1),
    message: z.string().min(1),
    closeAfter: z.date().optional(),
  })
  .describe("Opens a new ticket");

export const AssignTicket = z
  .object({
    agentId: z.string().uuid(),
    reassignAfter: z.date(),
    escalateAfter: z.date(),
  })
  .describe("Assigns the ticket to an agent");

export const AddMessage = z
  .object({
    to: z.string().uuid(),
    body: z.string().min(1),
    attachments: z.record(z.string().url(), Attachment),
  })
  .describe("Add a new message to the ticket");

export const CloseTicket = ZodEmpty.describe("Closes the ticket");

export const RequestTicketEscalation = ZodEmpty.describe(
  "Requests a ticket escalation"
);

export const EscalateTicket = z
  .object({
    requestId: z.string().uuid(),
    requestedById: z.string().uuid(),
  })
  .describe("Escalates the ticket");

export const ReassignTicket = z
  .object({
    agentId: z.string().uuid(),
    reassignAfter: z.date(),
    escalateAfter: z.date(),
  })
  .describe("Reassigns the ticket");

export const MarkMessageDelivered = z
  .object({
    messageId: z.string().uuid(),
  })
  .describe("Flags a message as delivered");

export const AcknowledgeMessage = z
  .object({
    messageId: z.string().uuid(),
  })
  .describe("Flags the message as read");

export const MarkTicketResolved = ZodEmpty.describe("Flags ticket as resolved");
