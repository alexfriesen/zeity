import type { H3Event } from 'h3';

import type { User } from '@zeity/database/user';
import { users } from '@zeity/database/user';

export async function refreshUserSession(
  event: H3Event,
  user?: Pick<User, 'id' | 'email' | 'name' | 'emailVerified'> | null
) {
  const session = await getUserSession(event);

  if (!session?.user?.id) {
    return;
  }

  if (!user) {
    user = await getUser(session.user.id);
  }

  if (!user) {
    return;
  }

  await setUserSession(event, {
    ...session,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      verified: Boolean(user.emailVerified),
    },
  });
}

function getUser(userId: string) {
  return useDrizzle()
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      emailVerified: users.emailVerified,
    })
    .from(users)
    .where(eq(users.id, userId))
    .then((rows) => rows[0]);
}
