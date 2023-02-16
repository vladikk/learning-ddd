import { app, bootstrap } from "@rotorsoft/eventually";
import { ExpressApp } from "@rotorsoft/eventually-express";
import { Assignment } from "./assignment.policy";
import { Ticket } from "./ticket.aggregate";

bootstrap(async () => {
  app(new ExpressApp()).with(Ticket).with(Assignment).build();
  await app().listen();
});
