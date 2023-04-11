import { Infer } from "@rotorsoft/eventually";
import { Message } from "../schemas";

// TODO: deliver message to user - notifications system?
export const deliverMessage = (
  message: Infer<typeof Message>
): Promise<void> => {
  return Promise.resolve();
};
