import { eq } from '../../utils/drizzle';
import { users } from '../../database/user';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  if (!session.user.id) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  await useDrizzle().delete(users).where(eq(users.id, session.user.id));

  return sendNoContent(event);
});
