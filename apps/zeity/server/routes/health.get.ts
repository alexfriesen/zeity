import { checkConnection } from '../utils/drizzle';

export default eventHandler(async () => {
  const db = await checkConnection();

  if (!db) {
    throw createError({
      statusCode: 400,
      message: 'Database connection failed',
    });
  }

  return { ok: true };
});
