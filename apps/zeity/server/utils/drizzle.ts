import { createConsola } from 'consola';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';

import * as schema from '../database/schema';

export { sql, eq, and, or } from 'drizzle-orm';

export const tables = schema;

const logger = createConsola({}).withTag('db');

const pool = new pg.Pool({
  connectionString: useRuntimeConfig().DATABASE_URL,
});

export function useDrizzle() {
  const db = drizzle({ client: pool, schema });
  return db;
}

export function useDrizzleMigration() {
  return {
    async run() {
      try {
        if (import.meta.dev) {
          await migrate(useDrizzle(), {
            migrationsFolder: './server/database/migrations',
          });

          logger.success('schema and db migrated');
        }
      } catch (error) {
        logger.error(error);
      }
    },
  };
}
