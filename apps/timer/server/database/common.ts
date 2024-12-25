import { timestamp } from 'drizzle-orm/pg-core';

export const timestampColumns = () => ({
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .notNull()
    .$onUpdate(() => new Date()),
});
