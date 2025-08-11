import { handleOAuthLogin, storeUserSession } from '~~/server/utils/auth';

const MICROSOFT_PROVIDER_ID = 'microsoft';

export default defineOAuthMicrosoftEventHandler({
  async onSuccess(event, { user }) {
    const linkedUser = await handleOAuthLogin(
      MICROSOFT_PROVIDER_ID,
      user.id,
      user.mail,
      user.displayName
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
