import { client, InferPolicy } from "@rotorsoft/eventually";
import { ReassingmentSchemas } from "./schemas";
import { reassignAgent } from "./services/agent";
import { Ticket } from "./ticket.aggregate";
import { Tickets } from "./ticket.projector";
import { rescheduleCronEvent } from "./utils";

const BATCH_SIZE = 10;

export const Reassingment = (): InferPolicy<typeof ReassingmentSchemas> => ({
  description: "Reassigns ticket after agent inactivity period",
  schemas: ReassingmentSchemas,
  on: {
    ReassignmentCronTriggered: () => {
      setImmediate(async () => {
        // load batch of tickets with expired agent response window
        const expired = await client().read(Tickets, {
          where: {
            reassignAfter: { lt: new Date() },
          },
          limit: BATCH_SIZE,
        });
        for (const ticket of expired) {
          const agent = await reassignAgent(ticket.state);
          await client().command(Ticket, "ReassignTicket", agent, {
            stream: ticket.state.id,
          });
        }
        expired.length === BATCH_SIZE &&
          rescheduleCronEvent(Reassingment, "ReassignmentCronTriggered", 10);
      });
      return Promise.resolve(undefined);
    },
  },
});
