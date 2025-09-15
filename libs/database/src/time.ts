import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { timestampColumns } from './common';
import { projects } from './project';
import { users } from './user';
import { organisations } from './organisation';

export const times = pgTable(
  'time',
  {
    id: uuid('id').defaultRandom().notNull().primaryKey(),

    start: timestamp('start', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
    duration: integer('duration').notNull(),
    notes: text('notes').notNull().default(''),

    projectId: uuid('project_id').references(() => projects.id, {
      onDelete: 'cascade',
    }),

    organisationId: uuid('organisation_id')
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    ...timestampColumns(),
  },
  (table) => [index().on(table.start), index().on(table.duration)]
);

export type Time = typeof times.$inferSelect; // return type when queried
export type NewTime = typeof times.$inferInsert; // insert type
