import {
  text,
  pgTable,
  uuid,
  uniqueIndex,
  timestamp,
} from 'drizzle-orm/pg-core';
import { timestampColumns } from './common';

export const users = pgTable(
  'user',
  {
    id: uuid('id').defaultRandom().notNull().primaryKey(),

    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: timestamp('email_verified', {
      mode: 'date',
      withTimezone: true,
    }),
    image: text('image'),

    ...timestampColumns(),
  },
  (table) => [uniqueIndex().on(table.email)]
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
