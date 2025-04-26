import { z } from 'zod';

import { organisations } from '@zeity/database/organisation';
import { ORGANISATION_MEMBER_ROLE_OWNER } from '@zeity/types/organisation';
import { eq } from '~~/server/utils/drizzle';
import { hasUserOrganisationMemberRole } from '~~/server/utils/organisation';

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

  const existing = await useDrizzle()
    .select()
    .from(organisations)
    .where(eq(organisations.id, params.data.orgId))
    .then((res) => res[0]);

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'organisation not found',
    });
  }

  if (
    !(await hasUserOrganisationMemberRole(session.user.id, params.data.orgId, [
      ORGANISATION_MEMBER_ROLE_OWNER,
    ]))
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
