import {
  jsonb,
  pgTable,
  serial,
  text,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { timestampColumns } from './common';
import { organisations } from './organisation';

export const organisationTeams = pgTable(
  'organisation_team',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 200 }).notNull(),
    description: text('description').notNull().default(''),
    permissions: jsonb('permissions').notNull().default('[]').$type<string[]>(),

    organisationId: uuid('organisation_id')
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),

    ...timestampColumns(),
  },
  (table) => [unique().on(table.organisationId, table.name)]
);

export type OrganisationTeam = typeof organisationTeams.$inferSelect; // return type when queried
export type NewOrganisationTeam = typeof organisationTeams.$inferInsert; // insert type
