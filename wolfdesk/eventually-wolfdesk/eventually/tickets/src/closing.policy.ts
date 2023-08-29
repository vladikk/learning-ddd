import { client, InferPolicy } from "@rotorsoft/eventually";
import { ClosingSchemas } from "./schemas";
import { Ticket } from "./ticket.aggregate";
import { Tickets } from "./ticket.projector";
import { rescheduleCronEvent } from "./utils";

export const CLOSING_ID = "00000000-0000-1000-0000-200000000000";
const BATCH_SIZE = 10;

export const Closing = (): InferPolicy<typeof ClosingSchemas> => ({
  description: "Closes tickets after inactivity period",
  schemas: ClosingSchemas,
  on: {
    CheckInactiveTicketsCronTriggered: () => {
      setImmediate(async () => {
        // load batch of tickets with expired inactivity window
        const expired = await client().read(Tickets, {
          where: {
            closeAfter: { lt: new Date() },
          },
          limit: BATCH_SIZE,
        });
        for (const ticket of expired) {
          await client().command(
            Ticket,
            "CloseTicket",
            {},
            {
              stream: ticket.state.id,
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
