import { bind, InferPolicy } from "@rotorsoft/eventually";
import { RequestedEscalationSchemas } from "./schemas";

export const RequestedEscalation = (): InferPolicy<
  typeof RequestedEscalationSchemas
> => ({
  description: "Escalates ticket upon request",
  schemas: RequestedEscalationSchemas,
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
            stream,
          }
        )
      );
    },
  },
});
