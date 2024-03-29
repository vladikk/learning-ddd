import { cmd, InferPolicy } from "@rotorsoft/eventually";
import { DeliverySchemas } from "./schemas";
import { deliverMessage } from "./services/notification";

export const Delivery = (): InferPolicy<typeof DeliverySchemas> => ({
  description: "Delivers new messages",
  schemas: DeliverySchemas,
  on: {
    MessageAdded: async ({ stream, data }) => {
      await deliverMessage(data);
      return cmd("MarkMessageDelivered", { messageId: data.messageId }, stream);
    },
  },
});
