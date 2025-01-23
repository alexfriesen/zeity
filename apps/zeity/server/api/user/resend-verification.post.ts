import { users } from '~~/server/database/user';
import { useUserVerification } from '~~/server/utils/user-verification';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const user = await useDrizzle()
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .then((rows) => rows[0]);
  if (user.emailVerified) {
    throw createError({
      statusCode: 400,
      message: 'Email already verified',
    });
  }

  const link = await useUserVerification(event).generateLink(session.user.id);
  await useMailer().sendMessageMail(
    user.email,
    'Verify your email',
    ['Click the link below to verify your email'],
    {
      url: link,
      text: 'Verify your email',
    }
  );

  return sendNoContent(event);
});
