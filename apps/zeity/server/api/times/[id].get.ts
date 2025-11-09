import { z } from 'zod';

import { findTimeById } from '~~/server/utils/time';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const organisation = await requireOrganisationSession(event);

  const params = await getValidatedRouterParams(
    event,
    z.object({
      id: z.uuid(),
    }).safeParse
  );

  if (!params.success) {
    throw createError({
      statusCode: 404,
      message: 'Not Found',
    });
  }

  const result = await findTimeById(params.data.id);
  if (!result) {
    throw createError({
      statusCode: 404,
      message: 'Not Found',
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
