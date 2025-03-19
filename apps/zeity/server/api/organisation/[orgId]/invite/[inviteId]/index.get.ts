import { z } from 'zod';

import {
  ORGANISATION_MEMBER_ROLE_ADMIN,
  ORGANISATION_MEMBER_ROLE_OWNER,
} from '@zeity/types/organisation';
import { eq, asc } from '@zeity/database';
import { organisationInvites } from '@zeity/database/organisation-invite';

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

  const query = await getValidatedQuery(
    event,
    z.object({
      offset: z.coerce.number().int().nonnegative().default(0),
      limit: z.coerce.number().int().positive().lte(500).default(10),
    }).safeParse
  );
  if (!query.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request queries',
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
    .select()
    .from(organisationInvites)
    .where(eq(organisationInvites.organisationId, params.data.orgId))
    .orderBy(asc(organisationInvites.createdAt));

  return result;
});
