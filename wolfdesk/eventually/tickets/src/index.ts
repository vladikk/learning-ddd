import { app, bootstrap } from "@rotorsoft/eventually";
import { ExpressApp } from "@rotorsoft/eventually-express";
import { Ticket } from "./ticket.aggregate";

bootstrap(async () => {
  app(new ExpressApp()).with(Ticket).build();
  await app().listen();
});
