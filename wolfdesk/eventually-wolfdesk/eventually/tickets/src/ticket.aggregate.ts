import {
  bind,
  Infer,
  InferAggregate,
  Invariant,
  InvariantError,
} from "@rotorsoft/eventually";
import { randomUUID } from "crypto";
import * as errors from "./errors";
import { Priority, TicketSchemas } from "./schemas";

type TicketState = Infer<typeof TicketSchemas.state>;

const mustBeOpen: Invariant<TicketState> = {
  description: "Ticket must be open",
  valid: (state) => !!state.productId && !state.closedById,
};

const mustBeUser: Invariant<TicketState> = {
  description: "Must be the owner",
  valid: (state, actor) => state.userId === actor?.id,
};

const mustBeUserOrAgent: Invariant<TicketState> = {
  description: "Must be owner or assigned agent",
  valid: (state, actor) =>
    state.userId === actor?.id || state.agentId === actor?.id,
};

export const Ticket = (
  stream: string
): InferAggregate<typeof TicketSchemas> => ({
  description: "A support ticket",
  stream,
  schemas: TicketSchemas,
  init: () => ({
    productId: "",
    userId: "",
    supportCategoryId: "",
    priority: Priority.Low,
    title: "",
    messages: {},
  }),

  reduce: {
    TicketOpened: (_, { data }) => {
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
          },
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
    AddMessage: [mustBeOpen, mustBeUserOrAgent],
    RequestTicketEscalation: [mustBeOpen, mustBeUser],
    EscalateTicket: [mustBeOpen],
    ReassignTicket: [mustBeOpen],
    MarkMessageDelivered: [mustBeOpen],
    AcknowledgeMessage: [mustBeOpen],
    MarkTicketResolved: [mustBeOpen, mustBeUserOrAgent],
  },

  on: {
    OpenTicket: (data, state, actor) => {
      if (state.productId) throw new errors.TicketCannotOpenTwiceError(stream);
      return Promise.resolve([
        bind("TicketOpened", {
          ...data,
          userId: actor?.id,
          messageId: randomUUID(),
        }),
      ]);
    },
    CloseTicket: (data, state, actor) => {
      return Promise.resolve([
        bind("TicketClosed", { ...data, closedById: actor?.id || "" }),
      ]);
    },
    AssignTicket: (data, state) => {
      return Promise.resolve([bind("TicketAssigned", data)]);
    },
    AddMessage: (data, state, actor) => {
      return Promise.resolve([
        bind("MessageAdded", {
          ...data,
          from: actor?.id,
          messageId: randomUUID(),
        }),
      ]);
    },
    RequestTicketEscalation: (data, state, actor) => {
      // escalation can only be requested after window expired
      if (state.escalateAfter && state.escalateAfter > new Date())
        throw new errors.TicketEscalationError(
          stream,
          actor?.id || "",
          "Cannot escalate before due date"
        );

      return Promise.resolve([
        bind("TicketEscalationRequested", {
          ...data,
          requestedById: actor?.id || "",
          requestId: randomUUID(),
        }),
      ]);
    },
    EscalateTicket: (data, state, actor) => {
      // only if ticket has not been escalated before?
      if (state.escalationId)
        throw new errors.TicketEscalationError(
          stream,
          actor?.id || "",
          "Cannot escalate more than once"
        );

      return Promise.resolve([
        bind("TicketEscalated", { ...data, escalationId: randomUUID() }),
      ]);
    },
    ReassignTicket: (data, state, actor) => {
      // is escalated
      if (!state.escalationId || !state.reassignAfter)
        throw new errors.TicketEscalationError(
          stream,
          actor?.id || "",
          "Cannot reassign without escalation"
        );
      // after reassignment window
      if (state.reassignAfter > new Date())
        throw new errors.TicketReassingmentError(
          stream,
          actor?.id || "",
          "Cannot reassign before due date"
        );
      // no message acknowledged by agent
      const ackedByAgent = Object.values(state.messages).filter(
        (msg) => msg.wasRead && msg.from === state.userId
      ).length;
      if (ackedByAgent)
        throw new errors.TicketReassingmentError(
          stream,
          actor?.id || "",
          "Cannot reassign after agent acknowledged"
        );

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
      if (msg.to !== actor?.id)
        throw new InvariantError(
          "AcknowledgeMessage",
          data,
          { stream, actor },
          "Must be receiver to ack"
        );

      return Promise.resolve([bind("MessageRead", { ...data })]);
    },
    MarkTicketResolved: (data, state, actor) => {
      return Promise.resolve([
        bind("TicketResolved", { ...data, resolvedById: actor?.id || "" }),
      ]);
    },
  },
});
