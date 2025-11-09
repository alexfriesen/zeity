import { z } from 'zod';

import { times } from '@zeity/database/time';
import { doesProjectsBelongsToOrganisation } from '~~/server/utils/project';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const organisation = await requireOrganisationSession(event);

  const body = await readValidatedBody(
    event,
    z.object({
      start: z.coerce.date(),
      duration: z.coerce.number().nonnegative().default(0),
      // tags: z.array(z.number()).optional(),
      projectId: z.uuid().optional(),
      notes: z.string().optional(),
    }).safeParse
  );

  if (!body.success) {
    throw createError({
      data: body.error,
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

  const result = await useDrizzle()
    .insert(times)
    .values({
      ...body.data,
      userId: session.user.id,
      organisationId: organisation.value,
    })
    .returning()
    .then((data) => data[0]);

  if (!result) {
    console.error('Failed to create time', result);
    throw createError({
      statusCode: 500,
      message: 'Failed to create time',
    });
  }

  return result;
});
