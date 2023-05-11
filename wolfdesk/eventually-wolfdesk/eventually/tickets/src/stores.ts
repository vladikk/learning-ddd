import { Infer, store } from "@rotorsoft/eventually";
import {
  PostgresProjectorStore,
  PostgresStore,
} from "@rotorsoft/eventually-pg";
import { TicketProjection } from "./schemas";

store(PostgresStore("tickets"));

export const ticketProjectorStore = PostgresProjectorStore<
  Infer<typeof TicketProjection>
>(
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
