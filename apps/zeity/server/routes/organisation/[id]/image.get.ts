import { z } from 'zod';
import { eq } from '@zeity/database';
import { organisations } from '@zeity/database/organisation';

import getEtag from 'etag';

export default defineEventHandler(async (event) => {
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

  const organisation = await useDrizzle()
    .select({
      image: organisations.image,
    })
    .from(organisations)
    .where(eq(organisations.id, params.data.id))
    .limit(1)
    .then((rows) => rows[0]);

  if (!organisation) {
    throw createError({
      statusCode: 404,
      message: 'Organisation not found',
    });
  }

  if (!organisation.image) {
    throw createError({
      statusCode: 404,
      message: 'Organisation image not found',
    });
  }

  const file = await readStorageFile(organisation.image);
  if (!file || !file.ok) {
    throw createError({
      statusCode: 404,
      message: 'File not found',
    });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const etag = getEtag(buffer);
  setResponseHeader(event, 'etag', etag);

  // // Check for if-none-match request header
  if (etag && getRequestHeader(event, 'if-none-match') === etag) {
    setResponseStatus(event, 304);
    return send(event);
  }

  // Content-Type header
  setResponseHeader(event, 'content-type', file.type);

  return file.blob();
});
