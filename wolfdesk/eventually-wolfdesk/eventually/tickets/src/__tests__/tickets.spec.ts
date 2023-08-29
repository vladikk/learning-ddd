import { app, broker, client, dispose, State } from "@rotorsoft/eventually";
import { Ticket } from "../ticket.aggregate";
import { Chance } from "chance";
import {
  addMessage,
  closeTicket,
  escalateTicket,
  markTicketResolved,
  openTicket,
  reassignTicket,
  target,
} from "./commands";
import { Tickets } from "../ticket.projector";
import { Assignment } from "../assignment.policy";

const chance = new Chance();

describe("tickets projector", () => {
  beforeAll(() => {
    app().with(Ticket).with(Assignment).with(Tickets).build();
  });

  afterAll(async () => {
    await dispose()();
  });

  it("should project tickets", async () => {
    const t = target();
    const title = "assign me";
    const message = "openting a new ticket for projection";
    await openTicket(t, title, message);
    await addMessage(t, "first message");
    await escalateTicket(t);
    await broker().drain();
    await reassignTicket(t);
    await markTicketResolved(t);
    await closeTicket(t);
    await broker().drain();

    const state = (await client().read(Tickets, t.stream!)).at(0)?.state!;
    expect(state.id).toBe(t.stream);
    expect(state.userId).toBeDefined();
    expect(state.agentId).toBeDefined();
    expect(state.title).toBe(title);
    expect(state.messages).toBe(2);
    expect(state.closedById).toBeDefined();
    expect(state.resolvedById).toBeDefined();
    expect(state.escalationId).toBeDefined();
    expect(state.closeAfter).toBeDefined();
    expect(state.escalateAfter).toBeDefined();
    expect(state.reassignAfter).toBeDefined();
    // just to check projection while preparing test
    console.table(state);
  });
});
