import { client, InferProjector } from "@rotorsoft/eventually";
import { TicketProjectorSchemas } from "./schemas";

export const Tickets = (): InferProjector<typeof TicketProjectorSchemas> => ({
  description: "Projects ticket events into a flat read model",
  schemas: TicketProjectorSchemas,
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
    TicketEscalationRequested: () => Promise.resolve({}),
    MessageDelivered: () => Promise.resolve({}),
    MessageRead: () => Promise.resolve({}),
  },
});
