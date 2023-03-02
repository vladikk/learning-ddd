import { client, Empty, Policy } from "@rotorsoft/eventually";
import { Ticket } from "./ticket.aggregate";
import { CheckInactiveTicketsCronTriggered } from "./ticket.event.schemas";
import { TicketProjection } from "./ticket.projector";
import * as types from "./types";

export const Closing = (): Policy<
  Pick<types.TicketCommands, "CloseTicket">,
  { CheckInactiveTicketsCronTriggered: Empty }
> => ({
  description: "Closes tickets after inactivity period",
  schemas: {
    events: { CheckInactiveTicketsCronTriggered },
    commands: { CloseTicket: "Closes ticket" },
  },
  on: {
    CheckInactiveTicketsCronTriggered: () => {
      setImmediate(async () => {
        // TODO: load batch of tickets with expired inactivity window (a query to the read model?)
        const expired: Array<TicketProjection> = [];
        for (const ticket of expired) {
          await client().command(
            Ticket,
            "CloseTicket",
            {
              ticketId: ticket.id,
              closedById: "Closing",
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
