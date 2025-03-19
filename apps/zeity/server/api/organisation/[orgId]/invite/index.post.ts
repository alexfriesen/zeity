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
      email: z.string().email(),
    }).safeParse
  );

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request body',
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

  const organisation = await useDrizzle()
    .select()
    .from(organisations)
    .where(eq(organisations.id, params.data.orgId))
    .then((res) => res[0]);

  const result = await useDrizzle()
    .insert(organisationInvites)
    .values({
      email: body.data.email,
      organisationId: params.data.orgId,
    })
    .returning()
    .then((res) => res[0]);

  if (!organisation || !result) {
    throw createError({
      statusCode: 400,
      message: 'Not found',
    });
  }

  await sendInviteMail(event, organisation, result);

  return result;
});
