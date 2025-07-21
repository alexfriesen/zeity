import { z } from 'zod';

import { eq, and, inArray } from '@zeity/database';
import { organisationMembers } from '@zeity/database/organisation-member';
import { organisationTeamMembers } from '@zeity/database/organisation-team-member';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const params = await getValidatedRouterParams(
    event,
    z.object({
      orgId: z.string().uuid(),
      teamId: z.string().uuid(),
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
      memberIds: z.array(z.string().uuid()).min(1).default([]),
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

  await useDrizzle().transaction(async (tx) => {
    // check if members exist in the organisation
    const existingMembers = await tx
      .select({ id: organisationMembers.id })
      .from(organisationMembers)
      .where(
        and(
          eq(organisationMembers.organisationId, params.data.orgId),
          inArray(organisationMembers.id, body.data.memberIds)
        )
      );

    if (existingMembers.length) {
      // Insert team members
      await tx.insert(organisationTeamMembers).values(
        existingMembers.map(({ id }) => ({
          memberId: id,
          teamId: params.data.teamId,
        }))
      );
    }
  });

  return sendNoContent(event);
});
