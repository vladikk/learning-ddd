import { app, broker, client, dispose } from "@rotorsoft/eventually";
import { Ticket } from "../ticket.aggregate";
import { Chance } from "chance";
import { openTicket, requestTicketEscalation } from "./commands";
import { RequestedEscalation } from "../requested-escalation.policy";

const chance = new Chance();

describe("requested escalation policy", () => {
  beforeAll(() => {
    app().with(Ticket).with(RequestedEscalation).build();
  });

  afterAll(async () => {
    await dispose()();
  });

  it("should request escalation", async () => {
    const userId = chance.guid();
    const ticketId = chance.guid();
    await openTicket(ticketId, "assign me", "Opening a new ticket", userId);
    await requestTicketEscalation(ticketId, userId);
    await broker().drain();

    const snapshot = await client().load(Ticket, ticketId);
    expect(snapshot.state.escalationId).toBeDefined();
  });
});
