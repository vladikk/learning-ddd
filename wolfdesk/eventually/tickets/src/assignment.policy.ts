import { bind, Policy } from "@rotorsoft/eventually";
import { randomUUID } from "crypto";
import * as types from "./types";
import { TicketOpened } from "./ticket.event.schemas";

export const Assignment = (): Policy<
  Pick<types.TicketCommands, "AssignTicket">,
  Pick<types.TicketEvents, "TicketOpened">
> => ({
  description: "Assigns agents to tickets using autopilot's AI",
  schemas: {
    events: { TicketOpened },
    commands: { AssignTicket: "Assigns agent to open ticket" },
  },
  on: {
    TicketOpened: ({ data }) => {
      // TODO: find best agent for this ticket - autopilot AI
      const agentId = randomUUID();
      const reassignAfter = new Date();
      const escalateAfter = new Date();
      return Promise.resolve(
        bind(
          "AssignTicket",
          { ticketId: data.ticketId, agentId, reassignAfter, escalateAfter },
          {
            id: data.ticketId,
          }
        )
      );
    },
  },
});
