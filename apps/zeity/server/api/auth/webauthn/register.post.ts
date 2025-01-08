import { z } from 'zod';

import { users } from '../../../database/user';
import { userCredentials } from '../../../database/user-credential';

export default defineWebAuthnRegisterEventHandler({
  validateUser: (user) =>
    z
      .object({
        userName: z.string().min(1).toLowerCase().trim(),
        displayName: z.string().min(1).trim(),
        email: z.string().email().min(1).toLowerCase().trim(),
      })
      .parseAsync(user),

  async onSuccess(event, { user, credential }) {
    const db = useDrizzle();

    const dbUser = await db
      .insert(users)
      .values({
        userName: user.userName,
        displayName: user.displayName,
        email: user.email,
      })
      .returning()
      .then((rows) => rows[0])
      .catch((e) => {
        console.error(e);

        throw createError({
          statusCode: 400,
          message: 'User already exists',
        });
      });

    if (!dbUser) {
      throw createError({
        statusCode: 400,
        message: 'User already exists',
      });
    }

    await db.insert(userCredentials).values({
      id: credential.id,
      userId: dbUser.id,
      publicKey: credential.publicKey,
      counter: credential.counter,
      backedUp: credential.backedUp,
      transports: credential.transports || [],
    });

    await setUserSession(event, {
      user: {
        id: dbUser.id,
        userName: dbUser.userName,
      },
    });
  },
  async excludeCredentials(event, userName) {
    return useDrizzle()
      .select({
        id: userCredentials.id,
        transports: userCredentials.transports,
      })
      .from(users)
      .innerJoin(userCredentials, eq(userCredentials.userId, users.id))
      .where(eq(users.userName, userName.toLowerCase().trim()));
  },
});
