import { z } from 'zod';

import { ORGANISATION_MEMBER_ROLE_MEMBER } from '@zeity/types/organisation';
import { organisationMembers } from '@zeity/database/organisation-member';
import { organisationInvites } from '@zeity/database/organisation-invite';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const query = await getValidatedQuery(
    event,
    z.object({
      token: z.string(),
    }).safeParse
  );

  if (!query.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request query',
    });
  }

  const jwt = await useUserInvite(event)
    .verifyToken(query.data.token)
    .catch(() => {
      throw createError({
        statusCode: 400,
        message: 'Invalid token',
      });
    });

  const invite = await useDrizzle()
    .select()
    .from(organisationInvites)
    .where(eq(organisationInvites.id, jwt.inviteId))
    .then((res) => res[0]);

  if (!invite || invite?.email !== session.user.email) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    });
  }

  const result = await useDrizzle().transaction(async (tx) => {
    const result = await tx
      .insert(organisationMembers)
      .values({
        organisationId: invite.organisationId,
        userId: session.user.id,
        role: ORGANISATION_MEMBER_ROLE_MEMBER,
      })
      .returning();

    await tx
      .delete(organisationInvites)
      .where(eq(organisationInvites.id, invite.id));

    return result;
  });

  return result;
});
