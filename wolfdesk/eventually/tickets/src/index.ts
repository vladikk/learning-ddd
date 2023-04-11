import {
  Actor,
  app,
  bootstrap,
  client,
  Scope,
  store,
} from "@rotorsoft/eventually";
import { ExpressApp, sse } from "@rotorsoft/eventually-express";
import { NextFunction, Request, Response } from "express";
import { engine } from "express-handlebars";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { Assignment } from "./assignment.policy";
import { AutomaticEscalation } from "./automatic-escalation.policy";
import { Closing } from "./closing.policy";
import { Delivery } from "./delivery.policy";
import { Reassingment } from "./reassignment.policy";
import { RequestedEscalation } from "./requested-escalation.policy";
import { ticketProjectorStore } from "./stores";
import { Ticket } from "./ticket.aggregate";
import { Tickets } from "./ticket.projector";

bootstrap(async () => {
  // TODO: move to CI/CD pipeline as migration step
  await store().seed();
  await ticketProjectorStore.seed();

  // mock auth middleware
  const userId = randomUUID();
  const mockedAuth = (
    req: Request & { actor?: Actor },
    _: Response,
    next: NextFunction
  ): void => {
    req.actor = {
      id: userId,
      name: "mocked user name",
      roles: [],
    };
    next();
  };

  const express = app(new ExpressApp())
    .with(Ticket)
    .with(Assignment)
    .with(Reassingment, { scope: Scope.public })
    .with(Delivery)
    .with(RequestedEscalation)
    .with(AutomaticEscalation, { scope: Scope.public })
    .with(Closing, { scope: Scope.public })
    .with(Tickets, { store: ticketProjectorStore })
    .build([mockedAuth]);

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

  const watching = sse("ticket");
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
