import { Aggregate, bind, Invariant } from "@rotorsoft/eventually";
import { randomUUID } from "crypto";
import * as errors from "./errors";
import { Priority } from "./ticket.schemas";
import * as types from "./types";

// invariants
const mustBeOpen: Invariant<types.Ticket> = {
  description: "Ticket must be open",
  valid: (state: types.Ticket) => !!state.productId && !state.closedById,
};

export const Ticket = (
  stream: string
): Aggregate<types.Ticket, types.TicketCommands, types.TicketEvents> => ({
  description: "A support ticket",
  stream,
  schemas: types.schemas,
  init: () => ({
    productId: "",
    userId: "",
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
        userId,
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

  given: {
    CloseTicket: [mustBeOpen],
    AssignTicket: [mustBeOpen],
    AddMessage: [mustBeOpen],
    RequestTicketEscalation: [mustBeOpen],
    EscalateTicket: [mustBeOpen],
    ReassignTicket: [mustBeOpen],
    MarkMessageDelivered: [mustBeOpen],
    AcknowledgeMessage: [mustBeOpen],
    MarkTicketResolved: [mustBeOpen],
  },

  on: {
    OpenTicket: (data, state) => {
      if (state.productId) throw new errors.TicketCannotOpenTwiceError(stream);
      return Promise.resolve([
        bind("TicketOpened", {
          ...data,
          messageId: randomUUID(),
        }),
      ]);
    },
    CloseTicket: (data, state) => {
      return Promise.resolve([bind("TicketClosed", data)]);
    },
    AssignTicket: (data, state) => {
      return Promise.resolve([bind("TicketAssigned", data)]);
    },
    AddMessage: (data, state) => {
      // only owner or assigned agent can add messages
      if (!(state.userId === data.from || state.agentId === data.from))
        throw new errors.UnauthorizedError(stream, data.from);

      // TODO: other invariants

      return Promise.resolve([
        bind("MessageAdded", {
          ...data,
          messageId: randomUUID(),
        }),
      ]);
    },
    RequestTicketEscalation: (data, state) => {
      // escalation can only be requested by owner after window expired
      if (state.userId != data.requestedById)
        throw new errors.UnauthorizedError(stream, data.requestedById);
      if (state.escalateAfter && state.escalateAfter > new Date())
        throw new errors.TicketEscalationError(stream, data.requestedById);

      // TODO: other invariants

      return Promise.resolve([
        bind("TicketEscalationRequested", { ...data, requestId: randomUUID() }),
      ]);
    },
    EscalateTicket: (data, state) => {
      // TODO: invariants
      // only if ticket has not been escalated before?

      return Promise.resolve([
        bind("TicketEscalated", { ...data, escalationId: randomUUID() }),
      ]);
    },
    ReassignTicket: (data, state) => {
      // TODO: invariants
      // is escalated and remaining time pct < .5 and no message acknowledged by agent

      return Promise.resolve([bind("TicketReassigned", { ...data })]);
    },
    MarkMessageDelivered: (data, state) => {
      if (!state.messages[data.messageId])
        throw new errors.MessageNotFoundError(data.messageId);
      return Promise.resolve([bind("MessageDelivered", { ...data })]);
    },
    AcknowledgeMessage: (data, state, actor) => {
      const msg = state.messages[data.messageId];
      if (!msg) throw new errors.MessageNotFoundError(data.messageId);

      // message can only be acknowledged by receiver
      if (msg.to !== actor?.name)
        throw new errors.UnauthorizedError(stream, actor?.name || "");

      // TODO: other invariants

      return Promise.resolve([bind("MessageRead", { ...data })]);
    },
    MarkTicketResolved: (data, state) => {
      // ticket can only be resolved by agent or owner?
      if (
        !(
          state.userId === data.resolvedById ||
          state.agentId === data.resolvedById
        )
      )
        throw new errors.UnauthorizedError(stream, data.resolvedById);

      // TODO: more invariants

      return Promise.resolve([bind("TicketResolved", { ...data })]);
    },
  },
});
