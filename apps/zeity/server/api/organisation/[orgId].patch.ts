import { z } from 'zod';

import { eq } from '~~/server/utils/drizzle';
import { hasUserOrganisationMemberRole } from '~~/server/utils/organisation';
import { organisations } from '@zeity/database/organisation';
import {
  ORGANISATION_MEMBER_ROLE_ADMIN,
  ORGANISATION_MEMBER_ROLE_OWNER,
} from '@zeity/types/organisation';

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

  const body = await readValidatedBody(
    event,
    z
      .object({
        name: z.string().trim().min(3).max(150),
      })
      .partial().safeParse
  );

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request body',
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
      ORGANISATION_MEMBER_ROLE_ADMIN,
    ]))
  ) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    });
  }

  const result = await useDrizzle()
    .update(organisations)
    .set(body.data)
    .where(eq(organisations.id, params.data.orgId))
    .returning()
    .then((res) => res[0]);

  return result;
});
