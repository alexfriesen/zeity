import type { User } from '@zeity/database/user';
import type { Organisation } from '@zeity/database/organisation';

export function getUserImagePath(
  user: Partial<Pick<User, 'id' | 'image'>> | null | undefined
) {
  if (user?.image && user.id) {
    return `${getHost()}/user/${user.id}/image`;
  }
  return undefined;
}

export function getOrganisationImagePath(
  org: Partial<Pick<Organisation, 'id' | 'image'>> | null | undefined
) {
  if (org?.image && org.id) {
    return `${getHost()}/organisation/${org.id}/image`;
  }
  return undefined;
}
