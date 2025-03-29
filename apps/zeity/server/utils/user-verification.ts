import { randomInt } from 'node:crypto';
import type { H3Event } from 'h3';
import { SignJWT, jwtVerify } from 'jose';

import { users } from '@zeity/database/user';
import { authOTP } from '@zeity/database/auth-otp';
import { JWT_ALGORITHM, useJwtSecret } from './jwt-secret';

const JWT_ISSUER = 'zeity';
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export function deleteUsersOTPs(userId: string) {
  return useDrizzle().delete(authOTP).where(eq(authOTP.userId, userId));
}
export function deleteExpiredOTPs() {
  const now = new Date();
  return useDrizzle().delete(authOTP).where(lte(authOTP.expiresAt, now));
}

export function generateOTP(length = 6) {
  let otp = '';

  for (let i = 0; i < length; i++) {
    otp += numbers[randomInt(numbers.length)];
  }

  return otp;
}
export async function verifyOTP(userId: string, code: string) {
  await deleteExpiredOTPs();

  const otp = await useDrizzle()
    .select()
    .from(authOTP)
    .where(
      and(
        eq(authOTP.userId, userId),
        eq(authOTP.code, code),
        gte(authOTP.expiresAt, new Date())
      )
    )
    .then((rows) => rows[0]);

  return otp;
}

export async function createOTP(userId: string) {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 5);

  await useDrizzle()
    .insert(authOTP)
    .values({
      code: otp,
      expiresAt,
      userId,
    })
    .returning({ id: authOTP.id });

  return otp;
}

export async function isUserVerified(userId: string) {
  const rows = await useDrizzle()
    .select({ emailVerified: users.emailVerified })
    .from(users)
    .where(eq(users.id, userId));
  return !!rows[0]?.emailVerified;
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
