import { app, client, dispose } from "@rotorsoft/eventually";
import { Ticket } from "../ticket.aggregate";
import { Chance } from "chance";
import { addMessage, openTicket } from "./commands";
import { Delivery } from "../delivery.policy";

const chance = new Chance();

describe("delivery policy", () => {
  beforeAll(() => {
    app().with(Ticket).with(Delivery).build();
  });

  afterAll(async () => {
    await dispose()();
  });

  it("should deliver new ticket", async () => {
    const ticketId = chance.guid();
    await openTicket(ticketId, "assign me", "Opening a new ticket");
    await addMessage(ticketId, "the body");
    const snapshot = await client().load(Ticket, ticketId, false);
    expect(
      Object.values(snapshot.state.messages).at(-1)?.wasDelivered
    ).toBeDefined();
  });
});
