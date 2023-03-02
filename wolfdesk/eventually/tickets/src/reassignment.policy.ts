import { client, Empty, Policy } from "@rotorsoft/eventually";
import { Ticket } from "./ticket.aggregate";
import { ReassignmentCronTriggered } from "./ticket.event.schemas";
import { TicketProjection } from "./ticket.projector";
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
      setImmediate(async () => {
        // TODO: load batch of tickets with expired agent response window (a query to the read model?)
        const expired: Array<TicketProjection> = [];
        for (const ticket of expired) {
          const agentId = ""; // TODO: find new agent
          await client().command(
            Ticket,
            "ReassignTicket",
            {
              ticketId: ticket.id,
              agentId,
            },
            {
              id: ticket.id,
            }
          );
        }
      });
      return Promise.resolve(undefined);
    },
  },
});
