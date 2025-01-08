import {
  text,
  pgTable,
  uuid,
  varchar,
  uniqueIndex,
  timestamp,
} from 'drizzle-orm/pg-core';
import { timestampColumns } from './common';

export const users = pgTable(
  'user',
  {
    id: uuid('id').defaultRandom().notNull().primaryKey(),

    userName: varchar('user_name', { length: 150 }).notNull().unique(),
    displayName: varchar('display_name', { length: 150 }).notNull(),

    email: text('email').notNull().unique(),
    emailVerified: timestamp('email_verified', {
      mode: 'date',
      withTimezone: true,
    }),

    ...timestampColumns(),
  },
  (table) => [uniqueIndex().on(table.email)]
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
