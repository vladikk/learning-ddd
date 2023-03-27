import { app, broker, client, dispose } from "@rotorsoft/eventually";
import { Ticket } from "../ticket.aggregate";
import { Chance } from "chance";
import { openTicket, requestTicketEscalation, target } from "./commands";
import { RequestedEscalation } from "../requested-escalation.policy";

const chance = new Chance();

describe("requested escalation policy", () => {
  beforeAll(() => {
    app().with(Ticket).with(RequestedEscalation).build();
  });

  afterAll(async () => {
    await dispose()();
  });

  it("should request escalation", async () => {
    const t = target();
    await openTicket(t, "assign me", "Opening a new ticket");
    await requestTicketEscalation(t);
    await broker().drain();

    const snapshot = await client().load(Ticket, t.stream || "");
    expect(snapshot.state.escalationId).toBeDefined();
  });
});
