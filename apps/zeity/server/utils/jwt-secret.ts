import type { H3Event } from 'h3';

export const JWT_ALGORITHM = 'HS256';

export async function useJwtSecret(event: H3Event) {
  const secret = useRuntimeConfig(event).jwtSecret;
  return new TextEncoder().encode(secret);
}
