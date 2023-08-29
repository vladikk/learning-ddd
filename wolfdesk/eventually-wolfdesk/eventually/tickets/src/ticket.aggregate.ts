import {
  emit,
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
    TicketClosed: (_, { data }) => data,
    TicketAssigned: (_, { data }) => data,
    MessageAdded: (_, { data }) => {
      return { messages: { [data.messageId]: { ...data } } };
    },
    TicketEscalationRequested: (_, { data }) => data,
    TicketEscalated: (_, { data }) => data,
    TicketReassigned: (_, { data }) => data,
    MessageDelivered: (_, { data }) => ({
      messages: { [data.messageId]: { wasDelivered: true } },
    }),
    MessageRead: (_, { data }) => ({
      messages: { [data.messageId]: { wasRead: true } },
    }),
    TicketResolved: (_, { data }) => data,
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
      return emit("TicketOpened", {
        ...data,
        userId: actor?.id!,
        messageId: randomUUID(),
      });
    },
    CloseTicket: (_, __, actor) =>
      emit("TicketClosed", { closedById: actor?.id! }),
    AssignTicket: (data) => emit("TicketAssigned", data),
    AddMessage: (data, _, actor) =>
      emit("MessageAdded", {
        ...data,
        from: actor?.id!,
        messageId: randomUUID(),
      }),
    RequestTicketEscalation: (_, state, actor) => {
      // escalation can only be requested after window expired
      if (state.escalateAfter && state.escalateAfter > new Date())
        throw new errors.TicketEscalationError(
          stream,
          actor?.id || "",
          "Cannot escalate before due date"
        );

      return emit("TicketEscalationRequested", {
        requestedById: actor?.id!,
        requestId: randomUUID(),
      });
    },
    EscalateTicket: (data, state, actor) => {
      // only if ticket has not been escalated before?
      if (state.escalationId)
        throw new errors.TicketEscalationError(
          stream,
          actor?.id || "",
          "Cannot escalate more than once"
        );

      return emit("TicketEscalated", { ...data, escalationId: randomUUID() });
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

      return emit("TicketReassigned", data);
    },
    MarkMessageDelivered: (data, state) => {
      if (!state.messages[data.messageId])
        throw new errors.MessageNotFoundError(data.messageId);
      return emit("MessageDelivered", data);
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

      return emit("MessageRead", data);
    },
    MarkTicketResolved: (_, __, actor) =>
      emit("TicketResolved", { resolvedById: actor?.id! }),
  },
});
