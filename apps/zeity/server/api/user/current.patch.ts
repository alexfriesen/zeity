import { z } from 'zod';

import { eq } from '../../utils/drizzle';
import { users } from '../../database/user';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const schema = z
    .object({
      displayName: z.string().min(1).trim(),
    })
    .partial();

  const body = await readValidatedBody(event, schema.safeParse);

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid body',
    });
  }

  const db = useDrizzle();
  const user = await db
    .update(users)
    .set(body.data)
    .where(eq(users.id, session.user.id))
    .returning()
    .then((rows) => rows[0]);

  return {
    user,
  };
});
