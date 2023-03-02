import { app, client, dispose } from "@rotorsoft/eventually";
import { Ticket } from "../ticket.aggregate";
import { Chance } from "chance";
import { openTicket } from "./commands";
import { AutomaticEscalation } from "../automatic-escalation.policy";

const chance = new Chance();

describe("automatic escalation policy", () => {
  beforeAll(() => {
    app().with(Ticket).with(AutomaticEscalation).build();
  });

  afterAll(async () => {
    await dispose()();
  });

  it("should request escalation", async () => {
    const ticketId = chance.guid();
    await openTicket(ticketId, "assign me", "Opening a new ticket");
    await client().event(AutomaticEscalation, {
      name: "EscalationCronTriggered",
      data: {},
      id: 0,
      stream: "",
      version: 0,
      created: new Date(),
      metadata: { correlation: "", causation: {} },
    });
    const snapshot = await client().load(Ticket, ticketId);
    expect(snapshot.state.escalationId).toBeDefined();
  });
});