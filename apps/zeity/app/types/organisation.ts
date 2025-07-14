import type { OrganisationMember } from '@zeity/database/organisation-member';

export type OrganisationMemberWithUser = Pick<
  OrganisationMember,
  'id' | 'userId' | 'organisationId' | 'role'
> & {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean | null | undefined;
    image?: string | null | undefined;
  };
};
