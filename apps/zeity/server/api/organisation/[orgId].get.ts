import { z } from 'zod';

import { eq, asc } from '~~/server/utils/drizzle';
import { users } from '@zeity/database/user';
import { organisations } from '@zeity/database/organisation';
import { organisationMembers } from '@zeity/database/organisation-member';
import { organisationInvites } from '@zeity/database/organisation-invite';

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
  const result = await useDrizzle()
    .select({
      id: organisations.id,
      name: organisations.name,
      image: organisations.image,
    })
    .from(organisations)
    .where(eq(organisations.id, params.data.orgId))
    .limit(1)
    .then((res) => ({
      ...res[0],
      image: res[0].image
        ? baseUrl + '/organisation/' + res[0].id + '/image'
        : null,
    }));

  if (!result) {
    throw createError({
      statusCode: 404,
      message: 'organisation not found',
    });
  }

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
    .orderBy(asc(organisationMembers.createdAt));

  if (!members.some((member) => member.userId === session.user.id)) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    });
  }

  const invites = await useDrizzle()
    .select({
      id: organisationInvites.id,
      organisationId: organisationInvites.organisationId,

      email: organisationInvites.email,
      createdAt: organisationInvites.createdAt,
    })
    .from(organisationInvites)
    .where(eq(organisationInvites.organisationId, params.data.orgId))
    .orderBy(asc(organisationInvites.createdAt));

  return {
    ...result,
    members,
    invites,
  };
});
