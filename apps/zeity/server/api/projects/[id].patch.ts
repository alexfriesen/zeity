import { z } from 'zod';

import { eq } from '@zeity/database';
import { projects } from '@zeity/database/project';
import { PROJECT_STATUSES } from '@zeity/types';
import { isUserOrganisationMemberByOrgId } from '~~/server/utils/organisation-permission';
import { doesProjectExist } from '~~/server/utils/project';

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

  const body = await readValidatedBody(
    event,
    z
      .object({
        name: z.string().max(150),
        status: z.enum(PROJECT_STATUSES),
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

  const result = await useDrizzle()
    .update(projects)
    .set(body.data)
    .where(eq(projects.id, params.data.id))
    .returning()
    .then((res) => res[0]);

  return result;
});
