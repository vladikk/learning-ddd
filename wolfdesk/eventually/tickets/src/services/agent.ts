import { randomUUID } from "crypto";
import { TicketProjection } from "../ticket.projector";
import { Priority } from "../ticket.schemas";

export type AvailableAgent = {
  agentId: string;
  reassignAfter: Date;
  escalateAfter: Date;
};

// TODO: find best agent for this ticket - autopilot AI
export const assignAgent = (
  category: string,
  priority: Priority
): AvailableAgent => {
  return {
    agentId: randomUUID(),
    reassignAfter: new Date(),
    escalateAfter: new Date(),
  };
};

// TODO: find best agent for this ticket - reassignment
export const reassignAgent = (ticket: TicketProjection): AvailableAgent => {
  return {
    agentId: randomUUID(),
    reassignAfter: new Date(Date.now() + 100000),
    escalateAfter: new Date(Date.now() + 100000),
  };
};
