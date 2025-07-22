import z from 'zod';
import { getOrganisationTeamsByOrgId } from '~~/server/utils/organisation';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const params = await getValidatedRouterParams(
    event,
    z.object({
      orgId: z.string().uuid(),
    }).safeParse
  );
  if (!params.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request params',
    });
  }

  const existing = await doesOrganisationExist(params.data.orgId);
  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Organisation not found',
    });
  }

  if (
    !(await canUserUpdateOrganisationByOrgId(session.user, params.data.orgId))
  ) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    });
  }

  const teams = await getOrganisationTeamsByOrgId(params.data.orgId);
  return teams;
});
