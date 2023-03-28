import {
  app,
  broker,
  client,
  CommittedEvent,
  dispose,
  InvariantError,
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
  target,
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
    const t = target();
    const agentId = chance.guid();
    const to = chance.guid();
    const title = "OpenTicket";

    await openTicket(t, title, "Opening a new ticket");
    await assignTicket(t, agentId, new Date(), new Date());
    await broker().drain();
    await addMessage(t, "first message", to);
    await requestTicketEscalation(t);
    await escalateTicket(t);

    const snapshot = await client().load(Ticket, t.stream || "", false);
    const message = Object.values(snapshot.state.messages).at(-1);

    expect(snapshot.state.title).toEqual(title);
    expect(snapshot.state.agentId).toEqual(agentId);
    expect(Object.keys(snapshot.state.messages).length).toBe(2);
    expect(message?.from).toEqual(t.actor?.id);
    expect(snapshot.applyCount).toBe(5);

    await reassignTicket(t);
    await markMessageDelivered(t, message?.messageId || "");
    await acknowledgeMessage(target(to, t.stream), message?.messageId || "");
    await markTicketResolved(t);
    await closeTicket(t);

    const snapshot2 = await client().load(Ticket, t.stream || "");
    const message2 = Object.values(snapshot2.state.messages).at(-1);

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
    const t = target();
    await openTicket(t, "opening once", "the first opening");
    await expect(
      openTicket(t, "opening twice", "the second opening")
    ).rejects.toThrow(errors.TicketCannotOpenTwiceError);
  });

  it("should throw when trying to close twice or empty", async () => {
    const t = target();
    await expect(closeTicket(t)).rejects.toThrow(InvariantError);
    await openTicket(t, "opening once", "the first opening");
    await closeTicket(t);
    await expect(closeTicket(t)).rejects.toThrow(InvariantError);
  });

  it("should throw when assigning agent to empty or closed ticket", async () => {
    const t = target();
    await expect(assignTicket(t)).rejects.toThrow(InvariantError);
    await openTicket(t, "opening once", "the first opening");
    await closeTicket(t);
    await expect(assignTicket(t)).rejects.toThrow(InvariantError);
  });

  it("should throw when adding message to empty or closed ticket", async () => {
    const t = target();
    await expect(addMessage(t, "message")).rejects.toThrow(InvariantError);
    await openTicket(t, "opening once", "the first opening");
    await closeTicket(t);
    await expect(addMessage(t, "message")).rejects.toThrow(InvariantError);
  });

  it("should throw when requesting escalation to empty or closed ticket", async () => {
    const t = target();
    await expect(requestTicketEscalation(t)).rejects.toThrow(InvariantError);
    await openTicket(t, "opening once", "the first opening");
    await closeTicket(t);
    await expect(requestTicketEscalation(t)).rejects.toThrow(InvariantError);
  });

  it("should throw when escalating empty or closed ticket", async () => {
    const t = target();
    await expect(escalateTicket(t)).rejects.toThrow(InvariantError);
    await openTicket(t, "opening once", "the first opening");
    await closeTicket(t);
    await expect(escalateTicket(t)).rejects.toThrow(InvariantError);
  });

  it("should throw when reassigning empty or closed ticket", async () => {
    const t = target();
    await expect(reassignTicket(t)).rejects.toThrow(InvariantError);
    await openTicket(t, "opening once", "the first opening");
    await closeTicket(t);
    await expect(reassignTicket(t)).rejects.toThrow(InvariantError);
  });

  it("should throw when marking messages delivered on empty or closed or invalid ticket", async () => {
    const t = target();
    await expect(markMessageDelivered(t, chance.guid())).rejects.toThrow(
      InvariantError
    );
    await openTicket(t, "opening once", "the first opening");
    await expect(markMessageDelivered(t, chance.guid())).rejects.toThrow(
      errors.MessageNotFoundError
    );
    await closeTicket(t);
    await expect(markMessageDelivered(t, chance.guid())).rejects.toThrow(
      InvariantError
    );
  });

  it("should throw when marking message read on empty or closed or invalid ticket", async () => {
    const t = target();
    await expect(acknowledgeMessage(t, chance.guid())).rejects.toThrow(
      InvariantError
    );
    await openTicket(t, "opening once", "the first opening");
    await expect(acknowledgeMessage(t, chance.guid())).rejects.toThrow(
      errors.MessageNotFoundError
    );
    await closeTicket(t);
    await expect(acknowledgeMessage(t, chance.guid())).rejects.toThrow(
      InvariantError
    );
  });

  it("should throw when resolving empty or closed ticket", async () => {
    const t = target();
    await expect(markTicketResolved(t)).rejects.toThrow(InvariantError);
    await openTicket(t, "opening once", "the first opening");
    await closeTicket(t);
    await expect(markTicketResolved(t)).rejects.toThrow(InvariantError);
  });
});
