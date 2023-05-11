import { Infer } from "@rotorsoft/eventually";
import { randomUUID } from "crypto";
import { Priority, TicketProjection } from "../schemas";

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
export const reassignAgent = (
  ticket: Infer<typeof TicketProjection>
): AvailableAgent => {
  return {
    agentId: randomUUID(),
    reassignAfter: new Date(Date.now() + 100000),
    escalateAfter: new Date(Date.now() + 100000),
  };
};
