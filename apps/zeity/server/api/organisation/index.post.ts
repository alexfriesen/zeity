import { z } from 'zod';

import { organisations } from '@zeity/database/organisation';
import { organisationMembers } from '@zeity/database/organisation-member';
import { ORGANISATION_MEMBER_ROLE_OWNER } from '@zeity/types/organisation';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const body = await readValidatedBody(
    event,
    z.object({
      name: z.string().trim().min(3).max(150),
    }).safeParse
  );

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request body',
    });
  }

  const result = await useDrizzle().transaction(async (tx) => {
    const org = await tx
      .insert(organisations)
      .values(body.data)
      .returning()
      .then((res) => res[0]);

    if (!org) {
      throw createError({
        statusCode: 500,
        message: 'Failed to create organisation',
      });
    }

    await tx.insert(organisationMembers).values({
      userId: session.user.id,
      organisationId: org.id,
      role: ORGANISATION_MEMBER_ROLE_OWNER,
    });

    return org;
  });

  return result;
});
