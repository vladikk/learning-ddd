import { app, seed, store } from "@rotorsoft/eventually";
import {
  PostgresProjectorStore,
  PostgresStore,
} from "@rotorsoft/eventually-pg";
import { Tickets } from "./ticket.projector";

store(PostgresStore("tickets"));
app()
  .with(Tickets, {
    projector: {
      store: PostgresProjectorStore("tickets_projection"),
      indexes: [{ userId: "asc" }, { agentId: "asc" }],
    },
  })
  .build();

// seed the stores
void seed();
