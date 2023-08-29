import { client, InferPolicy } from "@rotorsoft/eventually";
import { randomUUID } from "crypto";
import { AutomaticEscalationSchemas } from "./schemas";
import { Ticket } from "./ticket.aggregate";
import { Tickets } from "./ticket.projector";
import { rescheduleCronEvent } from "./utils";

export const AUTO_ESCALATION_ID = "00000000-0000-1000-0000-100000000000";
const BATCH_SIZE = 10;

export const AutomaticEscalation = (): InferPolicy<
  typeof AutomaticEscalationSchemas
> => ({
  description: "Escalates ticket when expected response time is not met",
  schemas: AutomaticEscalationSchemas,
  on: {
    EscalationCronTriggered: () => {
      setImmediate(async () => {
        // load batch of tickets with expired escalation time
        const expired = await client().read(Tickets, {
          where: {
            escalateAfter: { lt: new Date() },
          },
          limit: BATCH_SIZE,
        });
        for (const ticket of expired) {
          await client().command(
            Ticket,
            "EscalateTicket",
            {
              requestId: randomUUID(),
              requestedById: AUTO_ESCALATION_ID,
            },
            {
              stream: ticket.state.id,
            }
          );
        }
        expired.length === BATCH_SIZE &&
          rescheduleCronEvent(
            AutomaticEscalation,
            "EscalationCronTriggered",
            10
          );
      });
      return Promise.resolve(undefined);
    },
  },
});
