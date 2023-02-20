import { app, bootstrap } from "@rotorsoft/eventually";
import { ExpressApp } from "@rotorsoft/eventually-express";
import { Assignment } from "./assignment.policy";
import { Delivery } from "./delivery.policy";
import { RequestedEscalation } from "./requested-escalation.policy";
import { Ticket } from "./ticket.aggregate";
import { Tickets } from "./ticket.projector";

bootstrap(async () => {
  app(new ExpressApp())
    .with(Ticket)
    .with(Assignment)
    .with(Delivery)
    .with(RequestedEscalation)
    .with(Tickets)
    .build();
  await app().listen();
});
