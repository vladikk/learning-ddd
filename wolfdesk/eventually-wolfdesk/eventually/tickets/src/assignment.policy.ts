import { cmd, InferPolicy } from "@rotorsoft/eventually";
import { AssignmentSchemas } from "./schemas";
import { assignAgent } from "./services/agent";

export const Assignment = (): InferPolicy<typeof AssignmentSchemas> => ({
  description: "Assigns agents to tickets using autopilot's AI",
  schemas: AssignmentSchemas,
  on: {
    TicketOpened: ({ stream, data }) => {
      const agent = assignAgent(data.supportCategoryId, data.priority);
      return cmd("AssignTicket", agent, stream);
    },
  },
});
