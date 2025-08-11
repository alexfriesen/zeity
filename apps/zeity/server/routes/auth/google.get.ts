import { handleOAuthLogin, storeUserSession } from '~~/server/utils/auth';

const GOOGLE_PROVIDER_ID = 'google';

export default defineOAuthGoogleEventHandler({
  config: {
    authorizationParams: {
      access_type: 'offline',
    },
  },
  async onSuccess(event, { user }) {
    const linkedUser = await handleOAuthLogin(
      GOOGLE_PROVIDER_ID,
      user.sub,
      user.email,
      user.name,
      user.scope
    );
    if (!linkedUser) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found',
      });
    }

    await storeUserSession(event, linkedUser);
    return sendRedirect(event, '/auth');
  },
});
