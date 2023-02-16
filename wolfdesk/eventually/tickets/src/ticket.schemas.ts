import z from "zod";

export enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export const SupportCategory = z.object({
  supportCategoryId: z.string().uuid(),
  name: z.string().min(3),
  //policy: // TODO
});

export const Product = z.object({
  productId: z.string().uuid(),
  tenantId: z.string().uuid(),
  name: z.string().min(5),
});

export const Tenant = z.object({
  tenantId: z.string().uuid(),
  name: z.string().min(3),
  email: z.string().email(),
  website: z.string().optional(),
  supportCategories: z.record(z.string().uuid(), SupportCategory),
});

export const User = z.object({
  userId: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  isActive: z.boolean(),
  roleId: z.string().uuid(),
});

export const Role = z.object({
  roleId: z.string().uuid(),
  name: z.string().min(3),
});

export const Agent = User.and(
  z.object({
    tenantId: z.string().uuid(),
    //shifts: // TODO
  })
);

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
  ticketId: z.string().uuid(),
  productId: z.string().uuid(),
  supportCategoryId: z.string().uuid(),
  priority: z.nativeEnum(Priority),
  title: z.string().min(1),
  messages: z.record(z.string().uuid(), Message),
  agentId: z.string().uuid().optional(),
  escalationId: z.string().uuid().optional(),
  closedById: z.string().uuid().optional(),
});
