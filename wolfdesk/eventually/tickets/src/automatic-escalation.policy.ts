import { client, Empty, Operator, Policy } from "@rotorsoft/eventually";
import { randomUUID } from "crypto";
import { Ticket } from "./ticket.aggregate";
import { EscalationCronTriggered } from "./ticket.event.schemas";
import { TicketProjection, Tickets } from "./ticket.projector";
import * as types from "./types";

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
            limit: 10,
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
              requestedById: randomUUID(), // TODO: define policy uuid
            },
            {
              id: ticket.id,
            }
          );
        }
        // TODO: if batch size == MAX, can raise event recursively
        // if (expired.length == 100)
        //   await client().event(AutomaticEscalation, {
        //     name: "EscalationCronTriggered",
        //     data: {},
        //   });
      });
      return Promise.resolve(undefined);
    },
  },
});
