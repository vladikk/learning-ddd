import { bind, Policy } from "@rotorsoft/eventually";
import * as types from "./types";
import { TicketOpened } from "./ticket.event.schemas";
import { assignAgent } from "./services/agent";

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
    TicketOpened: ({ stream, data }) => {
      const agent = assignAgent(data.supportCategoryId, data.priority);
      return Promise.resolve(bind("AssignTicket", agent, { stream }));
    },
  },
});
