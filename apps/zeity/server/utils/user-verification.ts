import type { H3Event } from 'h3';
import { SignJWT, jwtVerify } from 'jose';

import { users } from '@zeity/database/user';
import { JWT_ALGORITHM, useJwtSecret } from './jwt-secret';

const JWT_ISSUER = 'zeity';

export function isUserVerified(userId: string) {
  return useDrizzle()
    .select({ emailVerified: users.emailVerified })
    .from(users)
    .where(eq(users.id, userId))
    .then((rows) => !!rows[0]?.emailVerified);
}

export function generateEmailVerificationToken(
  secret: Uint8Array,
  userId: string
) {
  return new SignJWT({ type: 'email-verification', userId })
    .setProtectedHeader({
      alg: JWT_ALGORITHM,
    })
    .setIssuer(JWT_ISSUER)
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secret);
}

export async function verifyEmailVerificationToken(
  secret: Uint8Array,
  token: string
) {
  const { payload } = await jwtVerify(token, secret, {
    issuer: JWT_ISSUER,
    algorithms: [JWT_ALGORITHM],
  });

  return payload;
}

export function useUserVerification(event: H3Event) {
  return {
    generateLink: async (userId: string) => {
      const jwtSecret = await useJwtSecret(event);
      const token = await generateEmailVerificationToken(jwtSecret, userId);

      const baseUrl = getRequestURL(event).origin;
      return `${baseUrl}/user/verify?token=${token}`;
    },
    generateToken: async (userId: string) => {
      const jwtSecret = await useJwtSecret(event);
      return generateEmailVerificationToken(jwtSecret, userId);
    },
    verifyToken: async (token: string) => {
      const jwtSecret = await useJwtSecret(event);
      return verifyEmailVerificationToken(jwtSecret, token);
    },
  };
}
