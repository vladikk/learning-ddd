import { client, Projector } from "@rotorsoft/eventually";
import { z } from "zod";
import { Priority } from "./ticket.schemas";
import { schemas, TicketEvents } from "./types";

const Schema = z.object({
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
    TicketOpened: ({ stream, data }) => {
      const { message, messageId, ...other } = data;
      return Promise.resolve({
        upserts: [
          {
            where: { id: stream },
            values: {
              ...other,
              messages: 1,
            },
          },
        ],
      });
    },
    TicketClosed: ({ stream, data }) => {
      return Promise.resolve({
        upserts: [
          {
            where: { id: stream },
            values: {
              closedById: data.closedById,
            },
          },
        ],
      });
    },
    TicketAssigned: ({ stream, data }) => {
      return Promise.resolve({
        upserts: [
          {
            where: { id: stream },
            values: {
              agentId: data.agentId,
              escalateAfter: data.escalateAfter,
              reassignAfter: data.reassignAfter,
            },
          },
        ],
      });
    },
    MessageAdded: async ({ stream, data }) => {
      let messages = 0;
      await client().read(Tickets, stream, (r) => {
        messages = r.state.messages;
      });
      return {
        upserts: [
          {
            where: { id: stream },
            values: {
              messages: messages + 1,
            },
          },
        ],
      };
    },
    TicketEscalated: ({ stream, data }) => {
      return Promise.resolve({
        upserts: [
          {
            where: { id: stream },
            values: {
              escalationId: data.escalationId,
            },
          },
        ],
      });
    },
    TicketReassigned: ({ stream, data }) => {
      return Promise.resolve({
        upserts: [
          {
            where: { id: stream },
            values: {
              agentId: data.agentId,
              escalateAfter: data.escalateAfter,
              reassignAfter: data.reassignAfter,
            },
          },
        ],
      });
    },
    TicketResolved: ({ stream, data }) => {
      return Promise.resolve({
        upserts: [
          {
            where: { id: stream },
            values: {
              resolvedById: data.resolvedById,
            },
          },
        ],
      });
    },
  },
});
