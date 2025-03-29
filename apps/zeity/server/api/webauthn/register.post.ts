import { z } from 'zod';

import { users } from '@zeity/database/user';
import { userCredentials } from '@zeity/database/user-credential';
import { getChallenge, storeChallenge } from '../../utils/webauthn';
import { createOTP } from '../../utils/user-verification';

export default defineWebAuthnRegisterEventHandler({
  storeChallenge(event, challenge, attemptId) {
    return storeChallenge(challenge, attemptId);
  },

  getChallenge(event, attemptId) {
    return getChallenge(attemptId);
  },

  validateUser: (user) =>
    z
      .object({
        userName: z.string().email().min(1).toLowerCase().trim(),
        displayName: z.string().min(1).trim(),
      })
      .parseAsync(user),

  async onSuccess(event, { user, credential }) {
    const db = useDrizzle();

    const dbUser = await db
      .insert(users)
      .values({
        name: user.displayName,
        email: user.userName,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        emailVerified: users.emailVerified,
      })
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
        name: dbUser.name,
        email: dbUser.email,
        verified: Boolean(dbUser.emailVerified),
      },
    });

    const otp = await createOTP(dbUser.id);

    await useMailer(event).sendWelcomeMail(dbUser.email, dbUser.name, otp);
  },

  async excludeCredentials(event, username) {
    return useDrizzle()
      .select({
        id: userCredentials.id,
        transports: userCredentials.transports,
      })
      .from(users)
      .innerJoin(userCredentials, eq(userCredentials.userId, users.id))
      .where(eq(users.email, username.toLowerCase().trim()));
  },
});
