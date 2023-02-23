import { bind, Empty, Policy } from "@rotorsoft/eventually";
import { randomUUID } from "crypto";
import { EscalationCronTriggered } from "./ticket.event.schemas";
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
      // TODO: load next ticket with expired reponse time (a query to the read model?)
      // TODO: if there are more than one, how to trigger this policy again - policies are limited to just 1 command output
      const ticketId = "";
      return Promise.resolve(
        bind(
          "EscalateTicket",
          {
            ticketId,
            requestId: randomUUID(),
            requestedBy: "AutomaticEscalation",
          },
          {
            id: ticketId,
          }
        )
      );
    },
  },
});
