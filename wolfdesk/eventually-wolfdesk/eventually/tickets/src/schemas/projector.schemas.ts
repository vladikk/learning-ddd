import { z } from "zod";
import { Priority } from "./schemas";
import { TicketSchemas } from "./ticket.schemas";

export const TicketProjection = z.object({
  // ids
  id: z.string().uuid(),
  productId: z.string().uuid(),
  supportCategoryId: z.string().uuid(),
  escalationId: z.string().uuid().optional(),
  // props
  priority: z.nativeEnum(Priority),
  title: z.string().min(1),
  messages: z.number().int(),
  // user ids
  userId: z.string().uuid(),
  agentId: z.string().uuid().optional(),
  resolvedById: z.string().uuid().optional(),
  closedById: z.string().uuid().optional(),
  // expiration windows
  reassignAfter: z.date().optional(),
  escalateAfter: z.date().optional(),
  closeAfter: z.date().optional(),
});

export const TicketProjectorSchemas = {
  state: TicketProjection,
  events: TicketSchemas.events,
};
