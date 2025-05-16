import type { User } from './user';

export const ORGANISATION_MEMBER_ROLE_OWNER = 'owner';
export const ORGANISATION_MEMBER_ROLE_ADMIN = 'admin';
export const ORGANISATION_MEMBER_ROLE_MEMBER = 'member';

export const ORGANISATION_MEMBER_ROLES = [
  ORGANISATION_MEMBER_ROLE_OWNER,
  ORGANISATION_MEMBER_ROLE_ADMIN,
  ORGANISATION_MEMBER_ROLE_MEMBER,
] as const;
export type OrganisationMemberRole = (typeof ORGANISATION_MEMBER_ROLES)[number];

export interface OrganisationMember {
  organisationId: string;
  userId: string;
  role: OrganisationMemberRole;

  user?: User | null;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}
export type NewOrganisationMember = Omit<
  OrganisationMember,
  'createdAt' | 'updatedAt'
>;

export interface OrganisationInvite {
  id: string;
  organisationId: string;
  email: string;

  createdAt?: string | Date;
}
export type NewOrganisationInvite = Omit<
  OrganisationInvite,
  'id' | 'createdAt' | 'updatedAt'
>;

export interface Organisation {
  id: string;
  name: string;
  image?: string | null;

  role?: OrganisationMemberRole | null;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}
export type NewOrganisation = Omit<
  Organisation,
  'id' | 'createdAt' | 'updatedAt'
>;
