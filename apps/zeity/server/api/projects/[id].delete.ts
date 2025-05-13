import { z } from 'zod';

import { eq } from '@zeity/database';
import { projects } from '@zeity/database/project';
import { doesProjectExist } from '~~/server/utils/project';
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

  const existing = await doesProjectExist(params.data.id);
  if (!existing) {
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

  await useDrizzle()
    .delete(projects)
    .where(eq(projects.id, params.data.id))
    .returning();

  return sendNoContent(event);
});
