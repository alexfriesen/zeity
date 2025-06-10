import { createConsola } from 'consola';

import {
  createDrizzle,
  createDrizzleMigration,
  createPool,
} from '@zeity/database';

export { sql, gte, lte, gt, lt, eq, and, or, asc, desc } from '@zeity/database';

const logger = createConsola({}).withTag('db');

const pool = createPool(useRuntimeConfig().DATABASE_URL);

export function useDrizzle() {
  const db = createDrizzle(pool);
  return db;
}

export function useDrizzleMigration() {
  const migrationsPath =
    process.env.MIGRATIONS_PATH || './server/database/migrations';

  return {
    async run() {
      try {
        await createDrizzleMigration(pool, migrationsPath);
        logger.success('schema and db migrated');
      } catch (error) {
        logger.fail('schema and db migrated');
        logger.error(error);
      }
    },
  };
}
