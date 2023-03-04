import { randomUUID } from "crypto";

export type AvailableAgent = {
  agentId: string;
  reassignAfter: Date;
  escalateAfter: Date;
};

// TODO: find best agent for this ticket - autopilot AI
export const findAgent = (): AvailableAgent => {
  return {
    agentId: randomUUID(),
    reassignAfter: new Date(),
    escalateAfter: new Date(),
  };
};
