import { app, broker, client, dispose, sleep } from "@rotorsoft/eventually";
import { Ticket } from "../ticket.aggregate";
import { Chance } from "chance";
import { assignTicket, escalateTicket, openTicket, target } from "./commands";
import { Reassingment } from "../reassignment.policy";
import { Tickets } from "../ticket.projector";

const chance = new Chance();

describe("reassignment policy", () => {
  beforeAll(() => {
    app().with(Ticket).with(Tickets).with(Reassingment).build();
  });

  afterAll(async () => {
    await dispose()();
  });

  it("should reassign", async () => {
    const now = new Date();
    const t = target();
    const agentId = chance.guid();

    await openTicket(t, "assign me", "Opening a new ticket");
    await assignTicket(t, agentId, now, now);
    await broker().drain();
    await escalateTicket(t);
    await broker().drain();

    await client().event(Reassingment, {
      name: "ReassignmentCronTriggered",
      data: {},
      id: 0,
      stream: "",
      version: 0,
      created: new Date(),
      metadata: { correlation: "", causation: {} },
    });
    await sleep(100); // wait for policy
    await broker().drain();

    const snapshot = await client().load(Ticket, t.stream!);
    expect(snapshot.state.agentId).toBeDefined();
    expect(snapshot.state.agentId).not.toEqual(agentId);
    expect(snapshot.state.reassignAfter?.getTime()).toBeGreaterThan(
      now.getTime()
    );
    expect(snapshot.state.escalateAfter?.getTime()).toBeGreaterThan(
      now.getTime()
    );
  });
});
