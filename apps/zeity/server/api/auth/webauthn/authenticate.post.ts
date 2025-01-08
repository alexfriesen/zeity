import { users } from '../../../database/user';
import { userCredentials } from '../../../database/user-credential';

export default defineWebAuthnAuthenticateEventHandler({
  async allowCredentials(event, userName) {
    const user = await useDrizzle()
      .select({ credentials: userCredentials })
      .from(users)
      .rightJoin(userCredentials, eq(userCredentials.userId, users.id))
      .where(eq(tables.users.userName, userName));

    return user.map((item) => item.credentials) || [];
  },

  async getCredential(event, credentialID) {
    const credential = await useDrizzle()
      .select({
        id: userCredentials.id,
        userId: userCredentials.userId,
        publicKey: userCredentials.publicKey,
        counter: userCredentials.counter,
        backedUp: userCredentials.backedUp,
        transports: userCredentials.transports,
        user: users,
      })
      .from(userCredentials)
      .innerJoin(users, eq(users.id, userCredentials.userId))
      .where(eq(userCredentials.id, credentialID))
      .then((rows) => rows[0]);

    if (!credential) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Credential not found',
      });
    }

    return credential;
  },

  async onSuccess(event, { credential }) {
    await setUserSession(event, {
      user: {
        id: credential.user.id,
        userName: credential.user.userName,
      },
    });
  },
});
