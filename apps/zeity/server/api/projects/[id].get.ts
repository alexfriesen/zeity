import { z } from 'zod';

import { eq } from '@zeity/database';
import { projects } from '@zeity/database/project';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const organisation = await requireOrganisationSession(event);

  const params = await getValidatedRouterParams(
    event,
    z.object({
      id: z.string().uuid(),
    }).safeParse
  );

  if (!params.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request params',
    });
  }

  const result = await useDrizzle()
    .select()
    .from(projects)
    .where(eq(projects.id, params.data.id))
    .then((res) => res[0]);

  if (!result) {
    throw createError({
      statusCode: 404,
      message: 'project not found',
    });
  }

  if (
    !(
      result.userId === session.user.id ||
      result.organisationId === organisation.value
    )
  ) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    });
  }

  return result;
});
