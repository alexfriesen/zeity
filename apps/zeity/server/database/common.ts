import { timestamp } from 'drizzle-orm/pg-core';

export const timestampColumns = () => ({
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .notNull()
    .$onUpdate(() => new Date()),
});
