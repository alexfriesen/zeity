import { z } from 'zod';
import {
  ORGANISATION_MEMBER_ROLE_ADMIN,
  ORGANISATION_MEMBER_ROLE_OWNER,
} from '@zeity/types/organisation';
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
