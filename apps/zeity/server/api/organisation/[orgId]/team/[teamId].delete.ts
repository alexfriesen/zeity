import { z } from 'zod';

import { eq, and } from '@zeity/database';
import { organisationTeams } from '@zeity/database/organisation-team';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const params = await getValidatedRouterParams(
    event,
    z.object({
      orgId: z.uuid(),
      teamId: z.uuid(),
    }).safeParse
  );
  if (!params.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request params',
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
    .delete(organisationTeams)
    .where(
      and(
        eq(organisationTeams.organisationId, params.data.orgId),
        eq(organisationTeams.id, params.data.teamId)
      )
    );

  return sendNoContent(event);
});
