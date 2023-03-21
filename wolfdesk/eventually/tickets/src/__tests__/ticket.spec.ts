import {
  app,
  client,
  CommittedEvent,
  dispose,
  log,
} from "@rotorsoft/eventually";
import { Ticket } from "../ticket.aggregate";
import { Chance } from "chance";
import {
  acknowledgeMessage,
  addMessage,
  assignTicket,
  closeTicket,
  escalateTicket,
  markMessageDelivered,
  markTicketResolved,
  openTicket,
  reassignTicket,
  requestTicketEscalation,
} from "./commands";
import * as errors from "../errors";

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
    await requestTicketEscalation(ticketId);
    await escalateTicket(ticketId);

    const snapshot = await client().load(Ticket, ticketId, false);
    const message = Object.values(snapshot.state.messages).at(0);

    expect(snapshot.state.title).toEqual(title);
    expect(snapshot.state.agentId).toEqual(agentId);
    expect(Object.keys(snapshot.state.messages).length).toBe(2);
    expect(message?.from).toEqual(userId);
    expect(snapshot.applyCount).toBe(5);

    await reassignTicket(ticketId);
    await markMessageDelivered(ticketId, message?.messageId || "");
    await acknowledgeMessage(ticketId, message?.messageId || "");
    await markTicketResolved(ticketId);
    await closeTicket(ticketId);

    const snapshot2 = await client().load(Ticket, ticketId);
    const message2 = Object.values(snapshot2.state.messages).at(0);

    expect(snapshot2.state.agentId).not.toEqual(agentId);
    expect(snapshot2.state.resolvedById).toBeDefined;
    expect(snapshot2.state.closedById).toBeDefined;
    expect(snapshot2.state.closeAfter).toBeDefined;
    expect(snapshot2.state.escalateAfter).toBeDefined;
    expect(snapshot2.state.reassignAfter).toBeDefined;
    expect(message2?.wasDelivered).toBe(true);
    expect(message2?.wasRead).toBe(true);

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
    ).rejects.toThrow(errors.TicketCannotOpenTwiceError);
  });

  it("should throw when trying to close twice or empty", async () => {
    const ticketId = chance.guid();
    await expect(closeTicket(ticketId)).rejects.toThrow(
      errors.TicketIsNotOpenError
    );
    await openTicket(ticketId, "opening once", "the first opening");
    await closeTicket(ticketId);
    await expect(closeTicket(ticketId)).rejects.toThrow(
      errors.TicketCannotCloseTwiceError
    );
  });

  it("should throw when assigning agent to empty or closed ticket", async () => {
    const ticketId = chance.guid();
    await expect(assignTicket(ticketId)).rejects.toThrow(
      errors.TicketIsNotOpenError
    );
    await openTicket(ticketId, "opening once", "the first opening");
    await closeTicket(ticketId);
    await expect(assignTicket(ticketId)).rejects.toThrow(
      errors.TicketIsClosedError
    );
  });

  it("should throw when adding message to empty or closed ticket", async () => {
    const ticketId = chance.guid();
    await expect(addMessage(ticketId, "message")).rejects.toThrow(
      errors.TicketIsNotOpenError
    );
    await openTicket(ticketId, "opening once", "the first opening");
    await closeTicket(ticketId);
    await expect(addMessage(ticketId, "message")).rejects.toThrow(
      errors.TicketIsClosedError
    );
  });

  it("should throw when requesting escalation to empty or closed ticket", async () => {
    const ticketId = chance.guid();
    await expect(requestTicketEscalation(ticketId)).rejects.toThrow(
      errors.TicketIsNotOpenError
    );
    await openTicket(ticketId, "opening once", "the first opening");
    await closeTicket(ticketId);
    await expect(requestTicketEscalation(ticketId)).rejects.toThrow(
      errors.TicketIsClosedError
    );
  });

  it("should throw when escalating empty or closed ticket", async () => {
    const ticketId = chance.guid();
    await expect(escalateTicket(ticketId)).rejects.toThrow(
      errors.TicketIsNotOpenError
    );
    await openTicket(ticketId, "opening once", "the first opening");
    await closeTicket(ticketId);
    await expect(escalateTicket(ticketId)).rejects.toThrow(
      errors.TicketIsClosedError
    );
  });

  it("should throw when reassigning empty or closed ticket", async () => {
    const ticketId = chance.guid();
    await expect(reassignTicket(ticketId)).rejects.toThrow(
      errors.TicketIsNotOpenError
    );
    await openTicket(ticketId, "opening once", "the first opening");
    await closeTicket(ticketId);
    await expect(reassignTicket(ticketId)).rejects.toThrow(
      errors.TicketIsClosedError
    );
  });

  it("should throw when marking messages delivered on empty or closed or invalid ticket", async () => {
    const ticketId = chance.guid();
    await expect(markMessageDelivered(ticketId, chance.guid())).rejects.toThrow(
      errors.TicketIsNotOpenError
    );
    await openTicket(ticketId, "opening once", "the first opening");
    await expect(markMessageDelivered(ticketId, chance.guid())).rejects.toThrow(
      errors.MessageNotFoundError
    );
    await closeTicket(ticketId);
    await expect(markMessageDelivered(ticketId, chance.guid())).rejects.toThrow(
      errors.TicketIsClosedError
    );
  });

  it("should throw when marking message read on empty or closed or invalid ticket", async () => {
    const ticketId = chance.guid();
    await expect(acknowledgeMessage(ticketId, chance.guid())).rejects.toThrow(
      errors.TicketIsNotOpenError
    );
    await openTicket(ticketId, "opening once", "the first opening");
    await expect(acknowledgeMessage(ticketId, chance.guid())).rejects.toThrow(
      errors.MessageNotFoundError
    );
    await closeTicket(ticketId);
    await expect(acknowledgeMessage(ticketId, chance.guid())).rejects.toThrow(
      errors.TicketIsClosedError
    );
  });

  it("should throw when resolving empty or closed ticket", async () => {
    const ticketId = chance.guid();
    await expect(markTicketResolved(ticketId)).rejects.toThrow(
      errors.TicketIsNotOpenError
    );
    await openTicket(ticketId, "opening once", "the first opening");
    await closeTicket(ticketId);
    await expect(markTicketResolved(ticketId)).rejects.toThrow(
      errors.TicketIsClosedError
    );
  });
});
