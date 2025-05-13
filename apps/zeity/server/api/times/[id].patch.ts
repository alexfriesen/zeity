import { z } from 'zod';

import { eq } from '@zeity/database';
import { times } from '@zeity/database/time';
import { findTimeById } from '~~/server/utils/time';
import { doesProjectsBelongsToOrganisation } from '~~/server/utils/project';

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

  const body = await readValidatedBody(
    event,
    z
      .object({
        start: z.coerce.date(),
        duration: z.coerce.number().nonnegative(),
        // tags: z.array(z.number()).optional(),
        projectId: z.string().uuid().optional(),
        notes: z.string().optional(),
      })
      .partial().safeParse
  );

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request body',
    });
  }

  if (body.data.projectId) {
    const isOrganisationProject = await doesProjectsBelongsToOrganisation(
      body.data.projectId,
      organisation.value
    );
    if (!isOrganisationProject) {
      throw createError({
        statusCode: 403,
        message: 'Forbidden',
      });
    }
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

  const result = await useDrizzle()
    .update(times)
    .set(body.data)
    .where(eq(times.id, params.data.id))
    .returning()
    .then((res) => res[0]);

  return result;
});
