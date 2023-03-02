import { client } from "@rotorsoft/eventually";
import { Chance } from "chance";
import { Ticket } from "../ticket.aggregate";
import { Priority } from "../ticket.schemas";
const chance = new Chance();

export const openTicket = (
  ticketId: string,
  title: string,
  message: string,
  userId = chance.guid(),
  productId = chance.guid(),
  supportCategoryId = chance.guid(),
  priority = Priority.Low
) =>
  client().command(
    Ticket,
    "OpenTicket",
    {
      ticketId,
      productId,
      supportCategoryId,
      priority,
      userId,
      title,
      message,
    },
    { id: ticketId }
  );

export const assignTicket = (ticketId: string, agentId = chance.guid()) =>
  client().command(
    Ticket,
    "AssignTicket",
    {
      ticketId,
      agentId,
    },
    { id: ticketId }
  );

export const closeTicket = (ticketId: string, closedById = chance.guid()) =>
  client().command(
    Ticket,
    "CloseTicket",
    {
      ticketId,
      closedById,
    },
    { id: ticketId }
  );

export const addMessage = (
  ticketId: string,
  body: string,
  from = chance.guid(),
  to = chance.guid()
) =>
  client().command(
    Ticket,
    "AddMessage",
    {
      ticketId,
      body,
      from,
      to,
      attachments: {},
    },
    { id: ticketId }
  );

export const requestTicketEscalation = (
  ticketId: string,
  requestedById = chance.guid()
) =>
  client().command(
    Ticket,
    "RequestTicketEscalation",
    { ticketId, requestedById },
    { id: ticketId }
  );

export const escalateTicket = (
  ticketId: string,
  requestId = chance.guid(),
  requestedById = chance.guid()
) =>
  client().command(
    Ticket,
    "EscalateTicket",
    { ticketId, requestId, requestedById },
    { id: ticketId }
  );

export const reassignTicket = (ticketId: string, agentId = chance.guid()) =>
  client().command(
    Ticket,
    "ReassignTicket",
    { ticketId, agentId },
    { id: ticketId }
  );

export const markMessageDelivered = (ticketId: string, messageId: string) =>
  client().command(
    Ticket,
    "MarkMessageDelivered",
    { ticketId, messageId },
    { id: ticketId }
  );

export const acknowledgeMessage = (ticketId: string, messageId: string) =>
  client().command(
    Ticket,
    "AcknowledgeMessage",
    { ticketId, messageId },
    { id: ticketId }
  );

export const markTicketResolved = (
  ticketId: string,
  resolvedById = chance.guid()
) =>
  client().command(
    Ticket,
    "MarkTicketResolved",
    { ticketId, resolvedById },
    { id: ticketId }
  );
