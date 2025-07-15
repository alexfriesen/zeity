import { eq } from '@zeity/database';
import { users } from '@zeity/database/user';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const user = await useDrizzle()
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      emailVerified: users.emailVerified,
      image: users.image,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)
    .then((rows) => rows[0])
    .then((user) => ({
      ...user,
      emailVerified: Boolean(user?.emailVerified),
    }));

  return {
    user,
  };
});
