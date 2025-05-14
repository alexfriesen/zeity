import { z } from 'zod';

import { eq, asc } from '@zeity/database';
import { users } from '@zeity/database/user';
import { organisationMembers } from '@zeity/database/organisation-member';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const params = await getValidatedRouterParams(
    event,
    z.object({
      orgId: z.string().uuid(),
    }).safeParse
  );

  if (!params.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request params',
    });
  }

  const baseUrl = getRequestURL(event).origin;

  const members = await useDrizzle()
    .select({
      userId: organisationMembers.userId,
      organisationId: organisationMembers.organisationId,

      role: organisationMembers.role,
      user: users,
    })
    .from(organisationMembers)
    .leftJoin(users, eq(users.id, organisationMembers.userId))
    .where(eq(organisationMembers.organisationId, params.data.orgId))
    .orderBy(asc(organisationMembers.createdAt))
    .then((res) =>
      res.map((member) => ({
        ...member,
        user: {
          ...member.user,
          image: member.user?.image
            ? baseUrl + '/user/' + member.user.id + '/image'
            : undefined,
        },
      }))
    );

  if (!members.some((member) => member.userId === session.user.id)) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    });
  }

  return members;
});
