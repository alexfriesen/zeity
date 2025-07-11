import { count, inArray } from '@zeity/database';
import { organisations } from '@zeity/database/organisation';
import { organisationTeams } from '@zeity/database/organisation-team';
import { organisationTeamMembers } from '@zeity/database/organisation-team-member';
import { organisationMembers } from '@zeity/database/organisation-member';

import type { OrganisationMemberRole } from '@zeity/types/organisation';
import { ORGANISATION_MEMBER_ROLE_OWNER } from '@zeity/types/organisation';

export function doesOrganisationExist(organisationId: string) {
  return useDrizzle()
    .select({ id: organisations.id })
    .from(organisations)
    .where(eq(organisations.id, organisationId))
    .limit(1)
    .then((res) => res[0]?.id === organisationId);
}

export function hasUserOrganisationMemberRole(
  userId: string,
  organisationId: string,
  roles: OrganisationMemberRole[] = [ORGANISATION_MEMBER_ROLE_OWNER]
) {
  return useDrizzle()
    .select()
    .from(organisationMembers)
    .where(
      and(
        eq(organisationMembers.userId, userId),
        eq(organisationMembers.organisationId, organisationId),
        inArray(organisationMembers.role, roles)
      )
    )
    .then((res) => res.length > 0);
}

export function getOrganisationMemberByUserId(
  organisationId: string,
  userId: string
) {
  return useDrizzle()
    .select()
    .from(organisationMembers)
    .where(
      and(
        eq(organisationMembers.userId, userId),
        eq(organisationMembers.organisationId, organisationId)
      )
    )
    .limit(1);
}

export function getOrganisationMembersByUserIds(
  organisationId: string,
  userIds: string[]
) {
  return useDrizzle()
    .select()
    .from(organisationMembers)
    .where(
      and(
        inArray(organisationMembers.userId, userIds),
        eq(organisationMembers.organisationId, organisationId)
      )
    );
}

export function countOrganisationMemberOwner(
  organisationId: string,
  tx?: unknown
): Promise<number> {
  const db = (tx as ReturnType<typeof useDrizzle>) ?? useDrizzle();
  return db
    .select({ count: count() })
    .from(organisationMembers)
    .where(
      and(
        eq(organisationMembers.organisationId, organisationId),
        eq(organisationMembers.role, ORGANISATION_MEMBER_ROLE_OWNER)
      )
    )
    .then((res) => res[0]?.count ?? 0);
}

export function getOrganisationTeamsByOrgId(organisationId: string) {
  const db = useDrizzle();
  const membersCountSubquery = db
    .select({
      teamId: organisationTeamMembers.teamId,
      counter: sql<number>`count(*)`.mapWith(Number).as('members_count'),
    })
    .from(organisationTeamMembers)
    .groupBy(organisationTeamMembers.teamId)
    .as('members_count');

  return db
    .select({
      id: organisationTeams.id,
      name: organisationTeams.name,
      description: organisationTeams.description,
      memberCount: membersCountSubquery.counter,
    })
    .from(organisationTeams)
    .leftJoin(
      membersCountSubquery,
      eq(membersCountSubquery.teamId, organisationTeams.id)
    )
    .where(eq(organisationTeams.organisationId, organisationId));
}
