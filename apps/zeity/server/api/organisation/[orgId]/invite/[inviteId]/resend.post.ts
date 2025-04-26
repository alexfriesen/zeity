import { z } from 'zod';

import {
  ORGANISATION_MEMBER_ROLE_ADMIN,
  ORGANISATION_MEMBER_ROLE_OWNER,
} from '@zeity/types/organisation';
import { organisations } from '@zeity/database/organisation';
import { organisationInvites } from '@zeity/database/organisation-invite';
import { sendInviteMail } from '~~/server/utils/user-invite';

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

  const { organisation, organisation_invite } = await useDrizzle()
    .select()
    .from(organisationInvites)
    .leftJoin(
      organisations,
      eq(organisations.id, organisationInvites.organisationId)
    )
    .where(eq(organisationInvites.id, params.data.inviteId))
    .then((res) => res[0]);

  if (!organisation || !organisation_invite) {
    throw createError({
      statusCode: 404,
      message: 'organisation invite not found',
    });
  }

  await sendInviteMail(event, organisation, organisation_invite);

  return { success: true };
});
