import { client } from "@rotorsoft/eventually";
import { Chance } from "chance";
import { Ticket } from "../ticket.aggregate";
import { Priority } from "../ticket.schemas";
const chance = new Chance();
const DAY = 24 * 60 * 60 * 1000;
const oneDay = () => new Date(Date.now() + DAY);

export const openTicket = (
  ticketId: string,
  title: string,
  message: string,
  userId = chance.guid(),
  productId = chance.guid(),
  supportCategoryId = chance.guid(),
  priority = Priority.Low,
  closeAfter = oneDay()
) =>
  client().command(
    Ticket,
    "OpenTicket",
    {
      productId,
      supportCategoryId,
      priority,
      userId,
      title,
      message,
      closeAfter,
    },
    { id: ticketId }
  );

export const assignTicket = (
  ticketId: string,
  agentId = chance.guid(),
  escalateAfter = oneDay(),
  reassignAfter = oneDay()
) =>
  client().command(
    Ticket,
    "AssignTicket",
    {
      agentId,
      escalateAfter,
      reassignAfter,
    },
    { id: ticketId }
  );

export const closeTicket = (ticketId: string, closedById = chance.guid()) =>
  client().command(
    Ticket,
    "CloseTicket",
    {
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
    { requestedById },
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
    { requestId, requestedById },
    { id: ticketId }
  );

export const reassignTicket = (
  ticketId: string,
  agentId = chance.guid(),
  escalateAfter = oneDay(),
  reassignAfter = oneDay()
) =>
  client().command(
    Ticket,
    "ReassignTicket",
    { agentId, escalateAfter, reassignAfter },
    { id: ticketId }
  );

export const markMessageDelivered = (ticketId: string, messageId: string) =>
  client().command(
    Ticket,
    "MarkMessageDelivered",
    { messageId },
    { id: ticketId }
  );

export const acknowledgeMessage = (ticketId: string, messageId: string) =>
  client().command(
    Ticket,
    "AcknowledgeMessage",
    { messageId },
    { id: ticketId }
  );

export const markTicketResolved = (
  ticketId: string,
  resolvedById = chance.guid()
) =>
  client().command(
    Ticket,
    "MarkTicketResolved",
    { resolvedById },
    { id: ticketId }
  );
