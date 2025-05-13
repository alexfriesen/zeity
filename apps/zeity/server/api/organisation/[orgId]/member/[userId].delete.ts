import { z } from 'zod';

import { ORGANISATION_MEMBER_ROLE_OWNER } from '@zeity/types/organisation';
import { organisationMembers } from '@zeity/database/organisation-member';
import { countOrganisationMemberOwner } from '~~/server/utils/organisation';
import { canUserUpdateOrganisationByOrgId } from '~~/server/utils/organisation-permission';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const params = await getValidatedRouterParams(
    event,
    z.object({
      orgId: z.string().uuid(),
      userId: z.string().uuid(),
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

  if (
    await hasUserOrganisationMemberRole(params.data.userId, params.data.orgId, [
      ORGANISATION_MEMBER_ROLE_OWNER,
    ])
  ) {
    throw createError({
      statusCode: 400,
      message: 'Can not delete owner',
    });
  }

  await useDrizzle().transaction(async (tx) => {
    await tx
      .delete(organisationMembers)
      .where(
        and(
          eq(organisationMembers.organisationId, params.data.orgId),
          eq(organisationMembers.userId, params.data.userId)
        )
      );

    // check if organisation has at least one owner
    const ownerCount = await countOrganisationMemberOwner(
      params.data.orgId,
      tx
    );

    if (ownerCount < 1) {
      // rollback transaction
      tx.rollback();
      throw createError({
        statusCode: 400,
        message: 'Organisation must have at least one owner',
      });
    }
  });

  return sendNoContent(event);
});
