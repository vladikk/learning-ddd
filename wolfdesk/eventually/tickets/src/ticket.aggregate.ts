import { Aggregate, bind } from "@rotorsoft/eventually";
import { randomUUID } from "crypto";
import * as errors from "./errors";
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
      const { message, messageId, userId, ...other } = data;
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
      const { messageId, from, to, body, attachments } = data;
      messages[messageId] = { messageId, from, to, body, attachments };
      return { ...other, messages };
    },
    TicketEscalationRequested: (state, { data }) => ({ ...state, ...data }),
    TicketEscalated: (state, { data }) => ({ ...state, ...data }),
    TicketReassigned: (state, { data }) => ({ ...state, ...data }),
    MessageDelivered: (state, { data }) => {
      state.messages[data.messageId].wasDelivered = true;
      return { ...state };
    },
    MessageRead: (state, { data }) => {
      state.messages[data.messageId].wasRead = true;
      return { ...state };
    },
    TicketResolved: (state, { data }) => ({ ...state, ...data }),
  },

  // commands handlers
  on: {
    OpenTicket: (data, state) => {
      if (state.ticketId)
        throw new errors.TicketCannotOpenTwiceError(state.ticketId);
      return Promise.resolve([
        bind("TicketOpened", { ...data, messageId: randomUUID() }),
      ]);
    },
    CloseTicket: (data, state) => {
      if (!state.ticketId)
        throw new errors.TicketIsNotOpenError(state.ticketId);
      if (state.closedById)
        throw new errors.TicketCannotCloseTwiceError(state.ticketId);
      return Promise.resolve([bind("TicketClosed", data)]);
    },
    AssignTicket: (data, state) => {
      if (!state.ticketId)
        throw new errors.TicketIsNotOpenError(state.ticketId);
      if (state.closedById)
        throw new errors.TicketIsClosedError(state.ticketId);
      return Promise.resolve([bind("TicketAssigned", data)]);
    },
    AddMessage: (data, state) => {
      if (!state.ticketId)
        throw new errors.TicketIsNotOpenError(state.ticketId);
      if (state.closedById)
        throw new errors.TicketIsClosedError(state.ticketId);
      // TODO: check if data.from/data.to match this ticket
      return Promise.resolve([
        bind("MessageAdded", { ...data, messageId: randomUUID() }),
      ]);
    },
    RequestTicketEscalation: (data, state) => {
      if (!state.ticketId)
        throw new errors.TicketIsNotOpenError(state.ticketId);
      if (state.closedById)
        throw new errors.TicketIsClosedError(state.ticketId);
      // TODO: check other request escalation invariants
      return Promise.resolve([
        bind("TicketEscalationRequested", { ...data, requestId: randomUUID() }),
      ]);
    },
    EscalateTicket: (data, state) => {
      if (!state.ticketId)
        throw new errors.TicketIsNotOpenError(state.ticketId);
      if (state.closedById)
        throw new errors.TicketIsClosedError(state.ticketId);
      // TODO: check other escalation invariants
      return Promise.resolve([
        bind("TicketEscalated", { ...data, escalationId: randomUUID() }),
      ]);
    },
    ReassignTicket: (data, state) => {
      if (!state.ticketId)
        throw new errors.TicketIsNotOpenError(state.ticketId);
      if (state.closedById)
        throw new errors.TicketIsClosedError(state.ticketId);
      // TODO: check other reassignment invariants
      return Promise.resolve([bind("TicketReassigned", { ...data })]);
    },
    MarkMessageDelivered: (data, state) => {
      if (!state.ticketId)
        throw new errors.TicketIsNotOpenError(state.ticketId);
      if (state.closedById)
        throw new errors.TicketIsClosedError(state.ticketId);
      if (!state.messages[data.messageId])
        throw new errors.MessageNotFoundError(data.messageId);
      return Promise.resolve([bind("MessageDelivered", { ...data })]);
    },
    AcknowledgeMessage: (data, state) => {
      if (!state.ticketId)
        throw new errors.TicketIsNotOpenError(state.ticketId);
      if (state.closedById)
        throw new errors.TicketIsClosedError(state.ticketId);
      if (!state.messages[data.messageId])
        throw new errors.MessageNotFoundError(data.messageId);
      return Promise.resolve([bind("MessageRead", { ...data })]);
    },
    MarkTicketResolved: (data, state) => {
      if (!state.ticketId)
        throw new errors.TicketIsNotOpenError(state.ticketId);
      if (state.closedById)
        throw new errors.TicketIsClosedError(state.ticketId);
      // TODO: check other resolve invariants
      return Promise.resolve([bind("TicketResolved", { ...data })]);
    },
  },
});
