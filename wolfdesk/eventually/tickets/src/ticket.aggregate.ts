import { Aggregate, bind } from "@rotorsoft/eventually";
import { randomUUID } from "crypto";
import { Priority } from "./ticket.schemas";
import * as types from "./types";

export const Ticket = (
  id: string
): Aggregate<types.Ticket, types.TicketCommands, types.TicketEvents> => ({
  description: "A support ticket",
  stream: () => `Ticket-${id}`,
  schemas: types.schemas,
  init: () => ({
    ticketId: "",
    productId: "",
    supportCategoryId: "",
    priority: Priority.Low,
    title: "",
    messages: {},
  }),
  reduce: {
    TicketOpened: (state, { data }) => {
      const { message, userId, ...other } = data;
      const messageId = randomUUID();
      return {
        ...other,
        messages: {
          [messageId]: {
            messageId,
            from: userId,
            body: message,
            attachments: {},
          } as types.Message,
        },
      };
    },
    TicketClosed: (state, { data }) => ({ ...state, ...data }),
    TicketAssigned: (state, { data }) => ({ ...state, ...data }),
    MessageAdded: (state, { data }) => {
      const { messages, ...other } = state;
      const { from, to, body, attachments } = data;
      const messageId = randomUUID();
      messages[messageId] = { messageId, from, to, body, attachments };
      return { ...other, messages };
    },
    TicketEscalationRequested: (state) => state,
    TicketEscalated: (state) => state,
    TicketReassigned: (state) => state,
    MessageDelivered: (state) => state,
    MessageRead: (state) => state,
    TicketResolved: (state) => state,
  },

  // commands handlers
  on: {
    OpenTicket: (data, state) => {
      if (state.ticketId) throw new Error("Cannot open twice");
      return Promise.resolve([bind("TicketOpened", data)]);
    },
    CloseTicket: (data, state) => {
      if (!state.ticketId) throw new Error("Cannot close when empty");
      if (state.closedById) throw new Error("Cannot close twice");
      return Promise.resolve([bind("TicketClosed", data)]);
    },
    AssignTicket: (data, state) => {
      if (!state.ticketId) throw new Error("Cannot assign when empty");
      if (state.closedById) throw new Error("Cannot assign when closed");
      return Promise.resolve([bind("TicketAssigned", data)]);
    },
    AddMessage: (data, state) => {
      if (!state.ticketId) throw new Error("Cannot add when empty");
      if (state.closedById) throw new Error("Cannot add when closed");
      // TODO: check if data.from/data.to match this ticket
      return Promise.resolve([bind("MessageAdded", data)]);
    },
    RequestTicketEscalation: () => Promise.resolve([]),
    EscalateTicket: () => Promise.resolve([]),
    ReassignTicket: () => Promise.resolve([]),
    MarkMessageDelivered: () => Promise.resolve([]),
    AcknowledgeMessage: () => Promise.resolve([]),
    MarkTicketResolved: () => Promise.resolve([]),
  },
});
