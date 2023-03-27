import { client, Empty, Operator, Policy } from "@rotorsoft/eventually";
import { Ticket } from "./ticket.aggregate";
import { CheckInactiveTicketsCronTriggered } from "./ticket.event.schemas";
import { TicketProjection, Tickets } from "./ticket.projector";
import * as types from "./types";
import { rescheduleCronEvent } from "./utils";

export const CLOSING_ID = "00000000-0000-1000-0000-200000000000";
const BATCH_SIZE = 10;

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
            limit: BATCH_SIZE,
          },
          (p) => expired.push(p.state)
        );
        for (const ticket of expired) {
          await client().command(
            Ticket,
            "CloseTicket",
            {},
            {
              stream: ticket.id,
              actor: { id: CLOSING_ID, name: "Closing", roles: [] },
            }
          );
        }
        expired.length === BATCH_SIZE &&
          rescheduleCronEvent(Closing, "CheckInactiveTicketsCronTriggered", 10);
      });
      return Promise.resolve(undefined);
    },
  },
});
