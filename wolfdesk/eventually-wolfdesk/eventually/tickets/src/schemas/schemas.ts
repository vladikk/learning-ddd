import { z } from "zod";

export enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export const Attachment = z.object({
  url: z.string().url(),
});

export const Message = z.object({
  messageId: z.string().uuid(),
  body: z.string().min(1),
  from: z.string().uuid(),
  to: z.string().uuid().optional(),
  wasDelivered: z.boolean().optional(),
  wasRead: z.boolean().optional(),
  attachments: z.record(z.string().url(), Attachment),
});

export const Ticket = z.object({
  productId: z.string().uuid(),
  supportCategoryId: z.string().uuid(),
  priority: z.nativeEnum(Priority),
  title: z.string().min(1),
  userId: z.string().uuid(),
  messages: z.record(z.string().uuid(), Message),
  agentId: z.string().uuid().optional(),
  escalationId: z.string().uuid().optional(),
  resolvedById: z.string().uuid().optional(),
  closedById: z.string().uuid().optional(),
  reassignAfter: z.date().optional(),
  escalateAfter: z.date().optional(),
  closeAfter: z.date().optional(),
});
