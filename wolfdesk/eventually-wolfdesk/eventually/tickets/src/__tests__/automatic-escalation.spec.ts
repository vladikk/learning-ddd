import { app, broker, client, dispose, sleep } from "@rotorsoft/eventually";
import { Ticket } from "../ticket.aggregate";
import { Chance } from "chance";
import { assignTicket, openTicket, target } from "./commands";
import { AutomaticEscalation } from "../automatic-escalation.policy";
import { Tickets } from "../ticket.projector";

const chance = new Chance();

describe("automatic escalation policy", () => {
  beforeAll(() => {
    app().with(Ticket).with(Tickets).with(AutomaticEscalation).build();
  });

  afterAll(async () => {
    await dispose()();
  });

  it("should request escalation", async () => {
    const t = target();
    await openTicket(t, "assign me", "Opening a new ticket");
    await assignTicket(t, chance.guid(), new Date(), new Date());
    await broker().drain();

    await client().event(AutomaticEscalation, {
      name: "EscalationCronTriggered",
      data: {},
      id: 0,
      stream: "",
      version: 0,
      created: new Date(),
      metadata: { correlation: "", causation: {} },
    });
    await broker().drain();

    const snapshot = await client().load(Ticket, t.stream || "");
    expect(snapshot.state.escalationId).toBeDefined();
  });
});
