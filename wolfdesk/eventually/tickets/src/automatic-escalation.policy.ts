import { client, Empty, Operator, Policy } from "@rotorsoft/eventually";
import { randomUUID } from "crypto";
import { Ticket } from "./ticket.aggregate";
import { EscalationCronTriggered } from "./ticket.event.schemas";
import { TicketProjection, Tickets } from "./ticket.projector";
import * as types from "./types";
import { rescheduleCronEvent } from "./utils";

export const AUTO_ESCALATION_ID = "00000000-0000-1000-0000-100000000000";
const BATCH_SIZE = 10;

export const AutomaticEscalation = (): Policy<
  Pick<types.TicketCommands, "EscalateTicket">,
  { EscalationCronTriggered: Empty }
> => ({
  description: "Escalates ticket when expected response time is not met",
  schemas: {
    events: { EscalationCronTriggered },
    commands: { EscalateTicket: "Escalates ticket" },
  },
  on: {
    EscalationCronTriggered: () => {
      setImmediate(async () => {
        // load batch of tickets with expired escalation time
        const expired: Array<TicketProjection> = [];
        await client().read(
          Tickets,
          {
            where: {
              escalateAfter: { operator: Operator.lt, value: new Date() },
            },
            limit: BATCH_SIZE,
          },
          (p) => expired.push(p.state)
        );
        for (const ticket of expired) {
          await client().command(
            Ticket,
            "EscalateTicket",
            {
              ticketId: ticket.id,
              requestId: randomUUID(),
              requestedById: AUTO_ESCALATION_ID,
            },
            {
              id: ticket.id,
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
