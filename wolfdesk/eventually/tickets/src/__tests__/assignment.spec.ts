import { app, client, dispose } from "@rotorsoft/eventually";
import { Ticket } from "../ticket.aggregate";
import { Chance } from "chance";
import { openTicket } from "./commands";
import { Assignment } from "../assignment.policy";

const chance = new Chance();

describe("assignment policy", () => {
  beforeAll(() => {
    app().with(Ticket).with(Assignment).build();
  });

  afterAll(async () => {
    await dispose()();
  });

  it("should assign agent to new ticket", async () => {
    const ticketId = chance.guid();
    await openTicket(ticketId, "assign me", "Opening a new ticket");
    const snapshot = await client().load(Ticket, ticketId, false);
    expect(snapshot.state.agentId).toBeDefined();
  });
});
