import { client, InferProjector, prj } from "@rotorsoft/eventually";
import { TicketProjectorSchemas } from "./schemas";

export const Tickets = (): InferProjector<typeof TicketProjectorSchemas> => ({
  description: "Projects ticket events into a flat read model",
  schemas: TicketProjectorSchemas,
  on: {
    TicketOpened: ({ stream, data }) => {
      const { message, messageId, ...other } = data;
      return prj({
        id: stream,
        ...other,
        messages: 1,
      });
    },
    TicketClosed: ({ stream, data }) =>
      prj({
        id: stream,
        ...data,
      }),
    TicketAssigned: ({ stream, data }) =>
      prj({
        id: stream,
        ...data,
      }),
    MessageAdded: async ({ stream }, map) => {
      const messages =
        map.records.get(stream)?.messages ??
        (await client().read(Tickets, stream)).at(0)?.state.messages ??
        0;
      return prj({
        id: stream,
        messages: messages + 1,
      });
    },
    TicketEscalated: ({ stream, data }) =>
      prj({
        id: stream,
        escalationId: data.escalationId,
      }),
    TicketReassigned: ({ stream, data }) =>
      prj({
        id: stream,
        ...data,
      }),
    TicketResolved: ({ stream, data }) =>
      prj({
        id: stream,
        ...data,
      }),
    TicketEscalationRequested: () => prj(),
    MessageDelivered: () => prj(),
    MessageRead: () => prj(),
  },
});
