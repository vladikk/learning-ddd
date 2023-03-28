import { client, CommandTarget } from "@rotorsoft/eventually";
import { Chance } from "chance";
import { Ticket } from "../ticket.aggregate";
import { Priority } from "../ticket.schemas";
const chance = new Chance();
const DAY = 24 * 60 * 60 * 1000;
const oneDay = () => new Date(Date.now() + DAY);

export const target = (
  userId = chance.guid(),
  ticketId = chance.guid()
): CommandTarget => ({
  stream: ticketId,
  actor: { id: userId, name: "actor", roles: [] },
});

export const openTicket = (
  target: CommandTarget,
  title: string,
  message: string,
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
      title,
      message,
      closeAfter,
    },
    target
  );

export const assignTicket = (
  target: CommandTarget,
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
    target
  );

export const closeTicket = (target: CommandTarget) =>
  client().command(Ticket, "CloseTicket", {}, target);

export const addMessage = (
  target: CommandTarget,
  body: string,
  to = chance.guid()
) =>
  client().command(
    Ticket,
    "AddMessage",
    {
      body,
      to,
      attachments: {},
    },
    target
  );

export const requestTicketEscalation = (target: CommandTarget) =>
  client().command(Ticket, "RequestTicketEscalation", {}, target);

export const escalateTicket = (
  target: CommandTarget,
  requestId = chance.guid(),
  requestedById = chance.guid()
) =>
  client().command(
    Ticket,
    "EscalateTicket",
    { requestId, requestedById },
    target
  );

export const reassignTicket = (
  target: CommandTarget,
  agentId = chance.guid(),
  escalateAfter = oneDay(),
  reassignAfter = oneDay()
) =>
  client().command(
    Ticket,
    "ReassignTicket",
    { agentId, escalateAfter, reassignAfter },
    target
  );

export const markMessageDelivered = (
  target: CommandTarget,
  messageId: string
) => client().command(Ticket, "MarkMessageDelivered", { messageId }, target);

export const acknowledgeMessage = (target: CommandTarget, messageId: string) =>
  client().command(Ticket, "AcknowledgeMessage", { messageId }, target);

export const markTicketResolved = (target: CommandTarget) =>
  client().command(Ticket, "MarkTicketResolved", {}, target);
