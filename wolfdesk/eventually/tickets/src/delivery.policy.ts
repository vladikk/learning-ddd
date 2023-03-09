import { bind, Policy } from "@rotorsoft/eventually";
import * as types from "./types";
import { MessageAdded } from "./ticket.event.schemas";
import { deliverMessage } from "./services/notification";

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
    MessageAdded: async ({ data }) => {
      await deliverMessage(data);
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
