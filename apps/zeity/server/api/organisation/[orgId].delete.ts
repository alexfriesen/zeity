import { z } from 'zod';

import { eq } from '@zeity/database';
import { organisations } from '@zeity/database/organisation';
import { canUserDeleteOrganisationByOrgId } from '~~/server/utils/organisation-permission';
import { doesOrganisationExist } from '~~/server/utils/organisation';

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

  const existing = await doesOrganisationExist(params.data.orgId);
  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'organisation not found',
    });
  }

  if (
    !(await canUserDeleteOrganisationByOrgId(session.user, params.data.orgId))
  ) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    });
  }

  await useDrizzle()
    .delete(organisations)
    .where(eq(organisations.id, params.data.orgId))
    .returning();

  return sendNoContent(event);
});
