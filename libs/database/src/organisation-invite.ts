import { pgTable, uuid, text, uniqueIndex, index } from 'drizzle-orm/pg-core';

import { timestampColumns } from './common';
import { organisations } from './organisation';

export const organisationInvites = pgTable(
  'organisation_invite',
  {
    id: uuid('id').defaultRandom().notNull().primaryKey(),
    organisationId: uuid('organisation_id')
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),

    email: text('email').notNull(),

    createdAt: timestampColumns().createdAt,
  },
  (table) => [
    uniqueIndex().on(table.organisationId, table.email),
    index().on(table.email),
  ]
);

export type OrganisationInvite = typeof organisationInvites.$inferSelect;
export type NewOrganisationInvite = typeof organisationInvites.$inferInsert;
