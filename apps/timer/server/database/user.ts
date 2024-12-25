import {
  text,
  pgTable,
  uuid,
  varchar,
  boolean,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { timestampColumns } from './common';

export const users = pgTable(
  'user',
  {
    id: uuid('id').defaultRandom().notNull().primaryKey(),

    name: varchar('name', { length: 150 }).notNull(),
    description: text('description').notNull().default(''),

    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull().default(false),

    passwordHash: text('password_hash').notNull(),
    passwordSalt: text('password_salt').notNull(),

    ...timestampColumns(),
  },
  (table) => [uniqueIndex().on(table.email)]
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
