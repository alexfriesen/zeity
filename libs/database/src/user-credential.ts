import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  uuid,
} from 'drizzle-orm/pg-core';
import type { AuthenticatorTransportFuture } from '@simplewebauthn/server';

import { users } from './user';

export const userCredentials = pgTable(
  'user_credential',
  {
    id: text('id').notNull().unique(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    publicKey: text('public_key').notNull(),
    counter: integer('counter').notNull(),
    backedUp: boolean('backed_up').notNull(),
    transports: jsonb('transports')
      .notNull()
      .$type<AuthenticatorTransportFuture[]>(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.id] })]
);
