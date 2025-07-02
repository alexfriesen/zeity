import type { H3Event } from 'h3';
import { getCookie } from 'h3';

const ORGANISATION_COOKIE_NAME = 'organisation';

export function useOrganisationSession(event: H3Event) {
  const value = getCookie(event, ORGANISATION_COOKIE_NAME);

  return {
    value,
    setValue: (value: string) => {
      setCookie(event, ORGANISATION_COOKIE_NAME, value);
    },
  };
}

export function requireOrganisationSession(event: H3Event) {
  const session = useOrganisationSession(event);

  if (!session.value) {
    throw createError({
      statusCode: 400,
      message: 'Organisation not set',
    });
  }

  return {
    ...session,
    value: session.value,
  };
}
