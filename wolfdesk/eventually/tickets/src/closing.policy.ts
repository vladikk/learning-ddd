import { bind, Empty, Policy } from "@rotorsoft/eventually";
import { CheckInactiveTicketsCronTriggered } from "./ticket.event.schemas";
import * as types from "./types";

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
      // TODO: load next ticket with expired inactivity window (a query to the read model?)
      // TODO: if there are more than one, how to trigger this policy again - policies are limited to just 1 command output
      const ticketId = "";
      return Promise.resolve(
        bind(
          "CloseTicket",
          {
            ticketId,
            closedById: "Closing",
          },
          {
            id: ticketId,
          }
        )
      );
    },
  },
});
