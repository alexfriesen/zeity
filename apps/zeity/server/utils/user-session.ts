import type { H3Event } from 'h3';

import { users } from '@zeity/database/user';

export async function refreshUserSession(event: H3Event) {
  const session = await getUserSession(event);

  if (!session?.user?.id) {
    return;
  }

  const user = await useDrizzle()
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      emailVerified: users.emailVerified,
    })
    .from(users)
    .where(eq(users.id, session?.user?.id))
    .then((rows) => rows[0]);

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
