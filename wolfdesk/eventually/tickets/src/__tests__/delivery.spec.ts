import { app, broker, client, dispose } from "@rotorsoft/eventually";
import { Ticket } from "../ticket.aggregate";
import { addMessage, openTicket, target } from "./commands";
import { Delivery } from "../delivery.policy";

describe("delivery policy", () => {
  beforeAll(() => {
    app().with(Ticket).with(Delivery).build();
  });

  afterAll(async () => {
    await dispose()();
  });

  it("should deliver new ticket", async () => {
    const t = target();
    await openTicket(t, "assign me", "Opening a new ticket");
    await addMessage(t, "the body");
    await broker().drain();

    const snapshot = await client().load(Ticket, t.stream || "", false);
    expect(
      Object.values(snapshot.state.messages).at(-1)?.wasDelivered
    ).toBeDefined();
  });
});
