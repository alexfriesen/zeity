import { pgTable, text } from 'drizzle-orm/pg-core';
import { timestampColumns } from './common';

export const authChallenge = pgTable('auth_challenge', {
  id: text('id').notNull().primaryKey(),
  challenge: text('challenge').notNull(),

  createdAt: timestampColumns().createdAt,
});

export type AuthChallenge = typeof authChallenge.$inferSelect;
export type NewAuthChallenge = typeof authChallenge.$inferInsert;
