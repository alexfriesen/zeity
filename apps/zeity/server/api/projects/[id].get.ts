import { z } from 'zod';

import { findProjectById } from '~~/server/utils/project';
import { isUserOrganisationMemberByOrgId } from '~~/server/utils/organisation-permission';

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

  const result = await findProjectById(params.data.id);
  if (!result) {
    throw createError({
      statusCode: 404,
      message: 'project not found',
    });
  }

  if (
    !(await isUserOrganisationMemberByOrgId(session.user, organisation.value))
  ) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    });
  }

  return result;
});
