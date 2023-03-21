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
    TicketEscalationRequested: async ({ stream, data }) => {
      return Promise.resolve(
        bind(
          "EscalateTicket",
          {
            requestId: data.requestId,
            requestedById: data.requestedById,
          },
          {
            id: stream.substring("Ticket-".length),
          }
        )
      );
    },
  },
});
