import { count, inArray } from '@zeity/database';
import { organisations } from '@zeity/database/organisation';
import { organisationMembers } from '@zeity/database/organisation-member';
import {
  type OrganisationMemberRole,
  ORGANISATION_MEMBER_ROLE_OWNER,
} from '@zeity/types/organisation';

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

export function getUserOrganisationMember(
  userId: string,
  organisationId: string
) {
  return useDrizzle()
    .select()
    .from(organisationMembers)
    .where(
      and(
        eq(organisationMembers.userId, userId),
        eq(organisationMembers.organisationId, organisationId)
      )
    );
}

export function getOrganisationMembers(organisationId: string) {
  return useDrizzle()
    .select()
    .from(organisationMembers)
    .where(eq(organisationMembers.organisationId, organisationId));
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
