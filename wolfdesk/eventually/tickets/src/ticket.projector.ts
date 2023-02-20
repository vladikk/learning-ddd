import { Projector } from "@rotorsoft/eventually";
import { z } from "zod";
import { Priority } from "./ticket.schemas";
import { schemas, TicketEvents } from "./types";

const Schema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  supportCategoryId: z.string().uuid(),
  priority: z.nativeEnum(Priority),
  title: z.string().min(1),
  messages: z.number().int(),
  userId: z.string().uuid(),
  agentId: z.string().uuid().optional(),
  escalationId: z.string().uuid().optional(),
  closedById: z.string().uuid().optional(),
});
export type TicketProjection = z.infer<typeof Schema>;

export const Tickets = (): Projector<TicketProjection, TicketEvents> => ({
  description: "Projects ticket events into a flat read model",
  schemas: {
    state: Schema,
    events: schemas.events,
  },
  on: {
    TicketOpened: ({ data }) => {
      const { ticketId, message, messageId, ...other } = data;
      return Promise.resolve({
        upserts: [
          {
            where: { id: ticketId },
            values: {
              ...other,
              messages: 1,
            },
          },
        ],
      });
    },
    TicketClosed: ({ data }) => {
      return Promise.resolve({
        upserts: [
          {
            where: { id: data.ticketId },
            values: {
              closedById: data.closedById,
            },
          },
        ],
      });
    },
    TicketAssigned: ({ data }) => {
      return Promise.resolve({
        upserts: [
          {
            where: { id: data.ticketId },
            values: {
              agentId: data.agentId,
            },
          },
        ],
      });
    },
    MessageAdded: () => Promise.resolve({}),
    TicketEscalationRequested: () => Promise.resolve({}),
    TicketEscalated: () => Promise.resolve({}),
    TicketReassigned: () => Promise.resolve({}),
    MessageDelivered: () => Promise.resolve({}),
    MessageRead: () => Promise.resolve({}),
    TicketResolved: () => Promise.resolve({}),
  },
});
