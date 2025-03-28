import { pgTable, primaryKey, uuid, varchar } from 'drizzle-orm/pg-core';

import type { OrganisationMemberRole } from '@zeity/types/organisation';
import { timestampColumns } from './common';
import { organisations } from './organisation';
import { users } from './user';

export const organisationMembers = pgTable(
  'organisation_member',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    organisationId: uuid('organisation_id')
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),

    role: varchar('role', { length: 10 })
      .notNull()
      .$type<OrganisationMemberRole>(),

    ...timestampColumns(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.organisationId] })]
);

export type OrganisationMember = typeof organisationMembers.$inferSelect; // return type when queried
export type NewOrganisationMember = typeof organisationMembers.$inferInsert; // insert type
