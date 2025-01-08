import { eq } from '../../utils/drizzle';
import { users } from '../../database/user';

export default defineEventHandler(async (event) => {
  const db = useDrizzle();

  const session = await requireUserSession(event);

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .then((rows) => rows[0]);

  return {
    user,
  };
});
