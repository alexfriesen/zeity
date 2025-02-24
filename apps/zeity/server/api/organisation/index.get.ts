import { z } from 'zod';

import { eq, asc } from '@zeity/database';
import { organisations } from '@zeity/database/organisation';
import { organisationMembers } from '@zeity/database/organisation-member';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const query = await getValidatedQuery(
    event,
    z.object({
      offset: z.coerce.number().int().nonnegative().default(0),
      limit: z.coerce.number().int().positive().lte(500).default(40),
    }).safeParse
  );

  if (!query.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request queries',
    });
  }

  const result = await useDrizzle()
    .select({
      id: organisations.id,
      name: organisations.name,
    })
    .from(organisations)
    .leftJoin(
      organisationMembers,
      eq(organisationMembers.organisationId, organisations.id)
    )
    .where(eq(organisationMembers.userId, session.user.id))
    .orderBy(asc(organisations.name));

  return result;
});
