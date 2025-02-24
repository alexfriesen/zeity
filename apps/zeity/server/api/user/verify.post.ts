import { z } from 'zod';
import { users } from '@zeity/database/user';
import {
  isUserVerified,
  useUserVerification,
} from '~~/server/utils/user-verification';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const query = await getValidatedQuery(
    event,
    z.object({
      token: z.string(),
    }).safeParse
  );
  if (!query.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request query',
    });
  }

  // verify token
  const payload = await await useUserVerification(event)
    .verifyToken(query.data.token)
    .catch((e) => {
      console.error(e);
      return null;
    });
  // if token is invalid or userId in token does not match the session user id
  if (!payload || payload.userId !== session.user.id) {
    throw createError({
      statusCode: 400,
      message: 'Invalid token',
    });
  }

  // check if email is already verified
  const emailVerified = await isUserVerified(session.user.id);

  if (emailVerified) {
    throw createError({
      statusCode: 400,
      message: 'Email already verified',
    });
  }

  // update user emailVerified
  await useDrizzle()
    .update(users)
    .set({
      emailVerified: new Date(),
    })
    .where(eq(users.id, session.user.id));

  return sendNoContent(event, 202);
});
