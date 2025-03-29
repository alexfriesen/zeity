import {
  index,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { timestampColumns } from './common';
import { users } from './user';

export const authOTP = pgTable(
  'auth_otp',
  {
    id: serial('id').primaryKey(),
    code: text('code').notNull(),
    expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    createdAt: timestampColumns().createdAt,
  },
  (table) => [index().on(table.expiresAt)]
);

export type AuthOTP = typeof authOTP.$inferSelect;
export type NewAuthOTP = typeof authOTP.$inferInsert;
