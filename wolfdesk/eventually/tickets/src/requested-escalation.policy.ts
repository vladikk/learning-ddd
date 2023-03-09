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
    TicketEscalationRequested: async ({ data }) => {
      return Promise.resolve(
        bind(
          "EscalateTicket",
          {
            ticketId: data.ticketId,
            requestId: data.requestId,
            requestedById: data.requestedById,
          },
          {
            id: data.ticketId,
          }
        )
      );
    },
  },
});
