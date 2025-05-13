import type { User } from '@zeity/database/user';
import type { OrganisationMember } from '@zeity/database/organisation-member';
import {
  ORGANISATION_MEMBER_ROLE_ADMIN,
  ORGANISATION_MEMBER_ROLE_OWNER,
} from '@zeity/types';

const privilegedRoles = [
  ORGANISATION_MEMBER_ROLE_OWNER,
  ORGANISATION_MEMBER_ROLE_ADMIN,
];

export function isUserOrganisationMember(
  user: Pick<User, 'id'>,
  organisationMembers: OrganisationMember[]
) {
  return organisationMembers.some(
    (member) => member.userId === user.id && member.role
  );
}

export function isUserOrganisationMemberByOrgId(
  user: Pick<User, 'id'>,
  orgId: string
) {
  return getUserOrganisationMember(user.id, orgId).then((res) => {
    return res.length > 0;
  });
}

export function canUserReadOrganisation(
  user: Pick<User, 'id'>,
  organisationMembers: OrganisationMember[]
) {
  return isUserOrganisationMember(user, organisationMembers);
}

export function canUserUpdateOrganisation(
  user: Pick<User, 'id'>,
  organisationMembers: OrganisationMember[]
) {
  return organisationMembers.some(
    (member) =>
      member.userId === user.id && privilegedRoles.includes(member.role)
  );
}

export function canUserUpdateOrganisationByOrgId(
  user: Pick<User, 'id'>,
  orgId: string
) {
  return hasUserOrganisationMemberRole(user.id, orgId, [
    ORGANISATION_MEMBER_ROLE_OWNER,
    ORGANISATION_MEMBER_ROLE_ADMIN,
  ]);
}

export function canUserDeleteOrganisationByOrgId(
  user: Pick<User, 'id'>,
  orgId: string
) {
  return hasUserOrganisationMemberRole(user.id, orgId, [
    ORGANISATION_MEMBER_ROLE_OWNER,
  ]);
}
