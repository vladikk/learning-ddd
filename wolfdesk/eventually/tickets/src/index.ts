import { app, bootstrap, client, Scope, store } from "@rotorsoft/eventually";
import { ExpressApp, sse } from "@rotorsoft/eventually-express";
import {
  PostgresProjectorStore,
  PostgresStore,
} from "@rotorsoft/eventually-pg";
import { Assignment } from "./assignment.policy";
import { AutomaticEscalation } from "./automatic-escalation.policy";
import { Closing } from "./closing.policy";
import { Delivery } from "./delivery.policy";
import { Reassingment } from "./reassignment.policy";
import { RequestedEscalation } from "./requested-escalation.policy";
import { Ticket } from "./ticket.aggregate";
import { TicketProjection, Tickets } from "./ticket.projector";
import { engine } from "express-handlebars";
import path from "node:path";

bootstrap(async () => {
  await store(PostgresStore("tickets"));
  await store().seed();

  const pgTicketProjectorStore = PostgresProjectorStore<TicketProjection>(
    "tickets_projection",
    {
      id: 'varchar(100) COLLATE pg_catalog."default" NOT NULL PRIMARY KEY',
      productId: 'varchar(100) COLLATE pg_catalog."default"',
      supportCategoryId: 'varchar(100) COLLATE pg_catalog."default"',
      escalationId: 'varchar(100) COLLATE pg_catalog."default"',

      priority: 'varchar(10) COLLATE pg_catalog."default"',
      title: 'varchar(100) COLLATE pg_catalog."default"',
      messages: "integer",

      userId: 'varchar(100) COLLATE pg_catalog."default"',
      agentId: 'varchar(100) COLLATE pg_catalog."default"',
      resolvedById: 'varchar(100) COLLATE pg_catalog."default"',
      closedById: 'varchar(100) COLLATE pg_catalog."default"',

      reassignAfter: "timestamptz",
      escalateAfter: "timestamptz",
      closeAfter: "timestamptz",
    },
    `
    CREATE INDEX IF NOT EXISTS tickets_user_ix ON public.tickets_projection USING btree ("userId" ASC) TABLESPACE pg_default;
    CREATE INDEX IF NOT EXISTS tickets_agent_ix ON public.tickets_projection USING btree ("agentId" ASC) TABLESPACE pg_default;
    `
  );
  await pgTicketProjectorStore.seed();

  const express = app(new ExpressApp())
    .with(Ticket)
    .with(Assignment)
    .with(Reassingment, { scope: Scope.public })
    .with(Delivery)
    .with(RequestedEscalation)
    .with(AutomaticEscalation, { scope: Scope.public })
    .with(Closing, { scope: Scope.public })
    .with(Tickets, { store: pgTicketProjectorStore })
    .build();

  //-------------------------------------------------------------------------------------------------------------------
  //-- A little .hbs playground to watch ticket projections in real time
  //-- For demo purposes only - this is not really scalable!
  //-------------------------------------------------------------------------------------------------------------------
  express.engine(
    "hbs",
    engine({
      extname: ".hbs",
    })
  );
  express.set("view engine", "hbs");
  express.set("views", path.resolve(__dirname, "./views"));
  express.get("/playground", (_, res) => {
    res.render("playground");
  });

  const watching = sse<TicketProjection>("ticket");
  express.get("/ticket-watch", (req, res) => {
    watching.push(req, res);
  });

  app().on("projection", async ({ factory, results }) => {
    console.log(factory.name, results);
    const id = results.upserted.at(0)?.where.id;
    id &&
      (await client().read(Tickets, id, (ticket) =>
        watching.send(ticket.state)
      ));
  });
  //-------------------------------------------------------------------------------------------------------------------

  await app().listen();
});
