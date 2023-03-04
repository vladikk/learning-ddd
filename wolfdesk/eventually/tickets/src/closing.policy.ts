import { client, Empty, Operator, Policy } from "@rotorsoft/eventually";
import { randomUUID } from "crypto";
import { Ticket } from "./ticket.aggregate";
import { CheckInactiveTicketsCronTriggered } from "./ticket.event.schemas";
import { TicketProjection, Tickets } from "./ticket.projector";
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
        // load batch of tickets with expired inactivity window
        const expired: Array<TicketProjection> = [];
        await client().read(
          Tickets,
          {
            where: {
              closeAfter: { operator: Operator.lt, value: new Date() },
            },
            limit: 10,
          },
          (p) => expired.push(p.state)
        );
        for (const ticket of expired) {
          await client().command(
            Ticket,
            "CloseTicket",
            {
              ticketId: ticket.id,
              closedById: randomUUID(), // TODO: define policy uuid
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
