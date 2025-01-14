import {
  boolean,
  integer,
  json,
  pgTable,
  text,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

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
    transports: json('transports').notNull().$type<object[]>(),
  },
  (table) => [unique().on(table.userId, table.id)]
);
