import { bind, Policy } from "@rotorsoft/eventually";
import * as types from "./types";
import { MessageAdded } from "./ticket.event.schemas";

export const Delivery = (): Policy<
  Pick<types.TicketCommands, "MarkMessageDelivered">,
  Pick<types.TicketEvents, "MessageAdded">
> => ({
  description: "Delivers new messages",
  schemas: {
    events: { MessageAdded },
    commands: { MarkMessageDelivered: "Marks message as delivered" },
  },
  on: {
    MessageAdded: ({ data }) => {
      // TODO: deliver message to user - notifications system?
      return Promise.resolve(
        bind(
          "MarkMessageDelivered",
          { ticketId: data.ticketId, messageId: data.messageId },
          {
            id: data.ticketId,
          }
        )
      );
    },
  },
});
