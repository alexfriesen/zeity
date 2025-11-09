import { times } from '@zeity/database/time';
import z from 'zod';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const organisation = await requireOrganisationSession(event);

  const body = await readValidatedBody(
    event,
    z.array(
      z.object({
        start: z.coerce.date(),
        duration: z.coerce.number().nonnegative().default(0),
        // tags: z.array(z.number()).optional(),
        projectId: z.uuid().optional(),
        notes: z.string().optional(),
      })
    ).safeParse
  );

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request body',
    });
  }

  const projectIds = body.data
    .map((time) => time.projectId)
    .filter((id): id is string => !!id);

  if (projectIds.length > 0) {
    const isOrganisationProject = await doesProjectsBelongsToOrganisation(
      projectIds,
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
    .values(
      body.data.map((time) => ({
        ...time,
        userId: session.user.id,
        organisationId: organisation.value,
      }))
    )
    .returning();

  return result;
});
