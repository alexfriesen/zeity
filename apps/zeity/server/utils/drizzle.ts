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
  return {
    async run() {
      try {
        if (import.meta.dev) {
          await createDrizzleMigration(pool, './server/database/migrations');

          logger.success('schema and db migrated');
        }
      } catch (error) {
        logger.error(error);
      }
    },
  };
}
