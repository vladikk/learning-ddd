import { app, client, dispose } from "@rotorsoft/eventually";
import { Ticket } from "../ticket.aggregate";
import { Chance } from "chance";
import { openTicket } from "./commands";
import { Reassingment } from "../reassignment.policy";

const chance = new Chance();

describe("reassignment escalation policy", () => {
  beforeAll(() => {
    app().with(Ticket).with(Reassingment).build();
  });

  afterAll(async () => {
    await dispose()();
  });

  it("should reassign", async () => {
    const ticketId = chance.guid();
    await openTicket(ticketId, "assign me", "Opening a new ticket");
    await client().event(Reassingment, {
      name: "ReassignmentCronTriggered",
      data: {},
      id: 0,
      stream: "",
      version: 0,
      created: new Date(),
      metadata: { correlation: "", causation: {} },
    });
    const snapshot = await client().load(Ticket, ticketId);
    expect(snapshot.state.agentId).toBeDefined();
  });
});
