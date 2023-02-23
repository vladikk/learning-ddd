import { bind, Empty, Policy } from "@rotorsoft/eventually";
import { ReassignmentCronTriggered } from "./ticket.event.schemas";
import * as types from "./types";

export const Reassingment = (): Policy<
  Pick<types.TicketCommands, "ReassignTicket">,
  { ReassignmentCronTriggered: Empty }
> => ({
  description: "Reassigns ticket after agent inactivity period",
  schemas: {
    events: { ReassignmentCronTriggered },
    commands: { ReassignTicket: "Reassigns ticket" },
  },
  on: {
    ReassignmentCronTriggered: () => {
      // TODO: load next ticket with expired agent response window (a query to the read model?)
      // TODO: if there are more than one, how to trigger this policy again - policies are limited to just 1 command output
      const ticketId = "";
      const agentId = ""; // TODO: find new agent
      return Promise.resolve(
        bind(
          "ReassignTicket",
          {
            ticketId,
            agentId,
          },
          {
            id: ticketId,
          }
        )
      );
    },
  },
});
