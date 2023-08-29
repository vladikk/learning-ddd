import { cmd, InferPolicy } from "@rotorsoft/eventually";
import { RequestedEscalationSchemas } from "./schemas";

export const RequestedEscalation = (): InferPolicy<
  typeof RequestedEscalationSchemas
> => ({
  description: "Escalates ticket upon request",
  schemas: RequestedEscalationSchemas,
  on: {
    TicketEscalationRequested: ({ stream, data }) =>
      cmd("EscalateTicket", data, stream),
  },
});
