import { z } from 'zod';

import { eq, asc } from '@zeity/database';
import { times } from '@zeity/database/time';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const organisation = await requireOrganisationSession(event);

  const query = await getValidatedQuery(
    event,
    z.object({
      offset: z.coerce.number().int().nonnegative().default(0),
      limit: z.coerce.number().int().positive().lte(500).default(40),
      projectId: z.string().uuid().optional(),
    }).safeParse
  );

  if (!query.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request queries',
    });
  }

  const whereStatements = [
    eq(times.userId, session.user.id),
    eq(times.organisationId, organisation.value),
  ];

  if (query.data.projectId) {
    whereStatements.push(eq(times.projectId, query.data.projectId));
  }

  const result = await useDrizzle()
    .select()
    .from(times)
    .where(and(...whereStatements))
    .orderBy(asc(times.start))
    .limit(query.data.limit)
    .offset(query.data.offset);

  return result;
});
