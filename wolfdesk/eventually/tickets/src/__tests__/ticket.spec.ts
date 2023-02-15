import {
  app,
  client,
  CommittedEvent,
  dispose,
  log,
} from "@rotorsoft/eventually";
import { Ticket } from "../ticket.aggregate";
import { Chance } from "chance";
import { addMessage, assignTicket, closeTicket, openTicket } from "./commands";

const chance = new Chance();

describe("ticket", () => {
  beforeAll(() => {
    app().with(Ticket).build();
  });

  afterAll(async () => {
    await dispose()();
  });

  it("should travel the happy path", async () => {
    const ticketId = chance.guid();
    const agentId = chance.guid();
    const userId = chance.guid();
    const title = "OpenTicket";

    await openTicket(ticketId, title, "Opening a new ticket", userId);
    await assignTicket(ticketId, agentId);
    await addMessage(ticketId, "first message");
    await closeTicket(ticketId);

    const snapshot = await client().load(Ticket, ticketId, false);
    const message = Object.values(snapshot.state.messages).at(0);

    expect(snapshot.state.ticketId).toEqual(ticketId);
    expect(snapshot.state.title).toEqual(title);
    expect(snapshot.state.agentId).toEqual(agentId);
    expect(snapshot.state.closedById).toBeDefined;
    expect(Object.keys(snapshot.state.messages).length).toBe(2);
    expect(message?.from).toEqual(userId);
    expect(snapshot.applyCount).toBe(4);

    // log stream just for fun
    const events: CommittedEvent[] = [];
    await client().query({ limit: 10 }, (e) => events.push(e));
    log().events(events);
  });

  it("should throw when trying to open twice", async () => {
    const ticketId = chance.guid();
    await openTicket(ticketId, "opening once", "the first opening");
    await expect(
      openTicket(ticketId, "opening twice", "the second opening")
    ).rejects.toThrow("Cannot open twice");
  });

  it("should throw when trying to close twice or empty", async () => {
    const ticketId = chance.guid();
    await expect(closeTicket(ticketId)).rejects.toThrow(
      "Cannot close when empty"
    );
    await openTicket(ticketId, "opening once", "the first opening");
    await closeTicket(ticketId);
    await expect(closeTicket(ticketId)).rejects.toThrow("Cannot close twice");
  });

  it("should throw when assigning agent to empty or closed ticket", async () => {
    const ticketId = chance.guid();
    await expect(assignTicket(ticketId)).rejects.toThrow(
      "Cannot assign when empty"
    );
    await openTicket(ticketId, "opening once", "the first opening");
    await closeTicket(ticketId);
    await expect(assignTicket(ticketId)).rejects.toThrow(
      "Cannot assign when closed"
    );
  });

  it("should throw when adding message to empty or closed ticket", async () => {
    const ticketId = chance.guid();
    await expect(addMessage(ticketId, "message")).rejects.toThrow(
      "Cannot add when empty"
    );
    await openTicket(ticketId, "opening once", "the first opening");
    await closeTicket(ticketId);
    await expect(addMessage(ticketId, "message")).rejects.toThrow(
      "Cannot add when closed"
    );
  });
});
