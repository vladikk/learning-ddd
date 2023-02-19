import { app, bootstrap } from "@rotorsoft/eventually";
import { ExpressApp } from "@rotorsoft/eventually-express";
import { Assignment } from "./assignment.policy";
import { Delivery } from "./delivery.policy";
import { RequestedEscalation } from "./requested-escalation.policy";
import { Ticket } from "./ticket.aggregate";

bootstrap(async () => {
  app(new ExpressApp())
    .with(Ticket)
    .with(Assignment)
    .with(Delivery)
    .with(RequestedEscalation)
    .build();
  await app().listen();
});
