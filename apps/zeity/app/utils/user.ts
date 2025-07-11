import type { User } from '@zeity/database/user';
import { getRequestURL } from 'h3';

export function getAvatarPath(
  user: Partial<Pick<User, 'id' | 'image'>> | null | undefined
) {
  if (user?.image && user.id) {
    return `${getHost()}/user/${user.id}/image`;
  }
  return undefined;
}

function getHost() {
  if (import.meta.server) {
    const event = useNuxtApp().ssrContext?.event;
    if (event) {
      return getRequestURL(event).origin;
    }
  }
  return document.location.origin;
}
