import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';

import { timestampColumns } from './common';
import { organisationMembers } from './organisation-member';
import { organisationTeams } from './organisation-team';

export const organisationTeamMembers = pgTable(
  'organisation_team_member',
  {
    teamId: uuid('team_id')
      .notNull()
      .references(() => organisationTeams.id, { onDelete: 'cascade' }),
    memberId: uuid('member_id')
      .notNull()
      .references(() => organisationMembers.id, { onDelete: 'cascade' }),

    createdAt: timestampColumns().createdAt,
  },
  (table) => [primaryKey({ columns: [table.teamId, table.memberId] })]
);

export type OrganisationTeamMember =
  typeof organisationTeamMembers.$inferSelect; // return type when queried
export type NewOrganisationTeamMember =
  typeof organisationTeamMembers.$inferInsert; // insert type
