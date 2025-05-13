import { z } from 'zod';

import { eq } from '@zeity/database';
import { times } from '@zeity/database/time';
import { findTimeById } from '~~/server/utils/time';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const organisation = await requireOrganisationSession(event);

  const params = await getValidatedRouterParams(
    event,
    z.object({
      id: z.coerce.number(),
    }).safeParse
  );

  if (!params.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request params',
    });
  }

  const existing = await findTimeById(params.data.id);
  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'time not found',
    });
  }

  if (
    !(
      existing.userId === session.user.id ||
      existing.organisationId === organisation.value
    )
  ) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    });
  }

  await useDrizzle()
    .delete(times)
    .where(eq(times.id, params.data.id))
    .returning();

  return sendNoContent(event);
});
