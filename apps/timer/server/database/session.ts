import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestampColumns } from './common';
import { users } from './user';

export const sessions = pgTable('session', {
  id: varchar('id').primaryKey(),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  browser: varchar('browser', { length: 150 }),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  createdAt: timestampColumns().createdAt,
});

export type Session = typeof sessions.$inferSelect; // return type when queried
export type NewSession = typeof sessions.$inferInsert; // insert type
