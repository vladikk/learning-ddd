import { app, broker, client, dispose } from "@rotorsoft/eventually";
import { Ticket } from "../ticket.aggregate";
import { openTicket, target } from "./commands";
import { Assignment } from "../assignment.policy";

describe("assignment policy", () => {
  beforeAll(() => {
    app().with(Ticket).with(Assignment).build();
  });

  afterAll(async () => {
    await dispose()();
  });

  it("should assign agent to new ticket", async () => {
    const t = target();
    await openTicket(t, "assign me", "Opening a new ticket");
    await broker().drain();

    const snapshot = await client().load(Ticket, t.stream!);
    expect(snapshot.state.agentId).toBeDefined();
  });
});
