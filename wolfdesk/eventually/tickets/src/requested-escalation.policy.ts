import { bind, Policy } from "@rotorsoft/eventually";
import * as types from "./types";
import { TicketEscalationRequested } from "./ticket.event.schemas";

export const RequestedEscalation = (): Policy<
  Pick<types.TicketCommands, "EscalateTicket">,
  Pick<types.TicketEvents, "TicketEscalationRequested">
> => ({
  description: "Escalates ticket upon request",
  schemas: {
    events: { TicketEscalationRequested },
    commands: { EscalateTicket: "Escalates ticket" },
  },
  on: {
    TicketEscalationRequested: ({ data }) => {
      // TODO: implement escalation request logic
      return Promise.resolve(
        bind(
          "EscalateTicket",
          {
            ticketId: data.ticketId,
            requestId: data.requestId,
            requestedBy: data.requestedBy,
          },
          {
            id: data.ticketId,
          }
        )
      );
    },
  },
});
