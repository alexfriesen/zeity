import { z } from 'zod';

import { organisationInvites } from '@zeity/database/organisation-invite';
import { canUserUpdateOrganisationByOrgId } from '~~/server/utils/organisation-permission';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const params = await getValidatedRouterParams(
    event,
    z.object({
      orgId: z.string().uuid(),
      inviteId: z.string().uuid(),
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
    .delete(organisationInvites)
    .where(
      and(
        eq(organisationInvites.organisationId, params.data.orgId),
        eq(organisationInvites.id, params.data.inviteId)
      )
    );

  return sendNoContent(event);
});
