import { Projector } from "@rotorsoft/eventually";
import { z } from "zod";
import { schemas, TicketEvents } from "./types";

const Ticket = z.object({ id: z.string().uuid() });

export const Tickets = (): Projector<z.infer<typeof Ticket>, TicketEvents> => ({
  description: "Projects ticket events into a flat read model",
  schemas: {
    state: Ticket,
    events: schemas.events,
  },
  on: {
    TicketOpened: () => Promise.resolve({}),
    TicketClosed: () => Promise.resolve({}),
    TicketAssigned: () => Promise.resolve({}),
    MessageAdded: () => Promise.resolve({}),
    TicketEscalationRequested: () => Promise.resolve({}),
    TicketEscalated: () => Promise.resolve({}),
    TicketReassigned: () => Promise.resolve({}),
    MessageDelivered: () => Promise.resolve({}),
    MessageRead: () => Promise.resolve({}),
    TicketResolved: () => Promise.resolve({}),
  },
});
