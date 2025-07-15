import { z } from 'zod';

import { eq, and, inArray } from '@zeity/database';
import { organisationTeamMembers } from '@zeity/database/organisation-team-member';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const params = await getValidatedRouterParams(
    event,
    z.object({
      orgId: z.string().uuid(),
      teamId: z.coerce.number().int().positive(),
    }).safeParse
  );
  if (!params.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request params',
    });
  }

  const body = await readValidatedBody(
    event,
    z.object({
      memberIds: z.array(z.number()).min(1).default([]),
    }).safeParse
  );

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request body',
    });
  }

  if (
    !(await canUserUpdateOrganisationByOrgId(session.user, params.data.orgId))
  ) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    });
  }

  await useDrizzle()
    .delete(organisationTeamMembers)
    .where(
      and(
        eq(organisationTeamMembers.teamId, params.data.teamId),
        inArray(organisationTeamMembers.memberId, body.data.memberIds)
      )
    );

  return sendNoContent(event);
});
