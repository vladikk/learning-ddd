import { app, client, dispose, sleep } from "@rotorsoft/eventually";
import { Ticket } from "../ticket.aggregate";
import { Chance } from "chance";
import { openTicket } from "./commands";
import { Closing } from "../closing.policy";
import { Tickets } from "../ticket.projector";
import { Priority } from "../ticket.schemas";

const chance = new Chance();

describe("closing policy", () => {
  beforeAll(() => {
    app().with(Ticket).with(Tickets).with(Closing).build();
  });

  afterAll(async () => {
    await dispose()();
  });

  it("should close ticket", async () => {
    const ticketId = chance.guid();
    await openTicket(
      ticketId,
      "assign me",
      "Opening a new ticket",
      chance.guid(),
      chance.guid(),
      chance.guid(),
      Priority.High,
      new Date()
    );
    await client().event(Closing, {
      name: "CheckInactiveTicketsCronTriggered",
      data: {},
      id: 0,
      stream: "",
      version: 0,
      created: new Date(),
      metadata: { correlation: "", causation: {} },
    });
    await sleep(1000);
    const snapshot = await client().load(Ticket, ticketId);
    expect(snapshot.state.closedById).toBeDefined();
  });
});
