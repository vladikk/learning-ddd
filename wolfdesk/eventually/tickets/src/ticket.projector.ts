import { client, Projector } from "@rotorsoft/eventually";
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
  resolvedById: z.string().uuid().optional(),
  closedById: z.string().uuid().optional(),
});
export type TicketProjection = z.infer<typeof Schema>;

export const Tickets = (): Projector<
  TicketProjection,
  Omit<
    TicketEvents,
    "TicketEscalationRequested" | "MessageDelivered" | "MessageRead"
  >
> => ({
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
    MessageAdded: async ({ data }) => {
      let messages = 0;
      await client().read(Tickets, data.ticketId, (r) => {
        messages = r.state.messages;
      });
      return {
        upserts: [
          {
            where: { id: data.ticketId },
            values: {
              messages: messages + 1,
            },
          },
        ],
      };
    },
    TicketEscalated: ({ data }) => {
      return Promise.resolve({
        upserts: [
          {
            where: { id: data.ticketId },
            values: {
              escalationId: data.escalationId,
            },
          },
        ],
      });
    },
    TicketReassigned: ({ data }) => {
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
    TicketResolved: ({ data }) => {
      return Promise.resolve({
        upserts: [
          {
            where: { id: data.ticketId },
            values: {
              resolvedById: data.resolvedById,
            },
          },
        ],
      });
    },
  },
});
