import { z } from 'zod';

import {
  ORGANISATION_MEMBER_ROLE_ADMIN,
  ORGANISATION_MEMBER_ROLE_OWNER,
  ORGANISATION_MEMBER_ROLES,
} from '@zeity/types/organisation';
import { organisationMembers } from '@zeity/database/organisation-member';
import { countOrganisationMemberOwner } from '~~/server/utils/organisation';

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

  const body = await readValidatedBody(
    event,
    z
      .object({
        role: z.enum(ORGANISATION_MEMBER_ROLES),
      })
      .partial().safeParse
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

  const result = await useDrizzle().transaction(async (tx) => {
    const txResult = await tx
      .update(organisationMembers)
      .set(body.data)
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

    return txResult;
  });

  return result;
});
