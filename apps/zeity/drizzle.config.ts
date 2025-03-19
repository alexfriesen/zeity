import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: '../../libs/database/src/schema.ts',
  out: './server/database/migrations',
});
