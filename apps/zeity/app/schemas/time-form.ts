import type { ZonedDateTime } from '@internationalized/date';
import { nanoid } from 'nanoid';
import z from 'zod';

import { TIME_TYPE_MANUAL, TIME_TYPES } from '@zeity/types';

export const timeSchema = z.object({
  id: z.string().default(nanoid),
  type: z.enum(TIME_TYPES).default(TIME_TYPE_MANUAL),
  start: z.custom<ZonedDateTime>(),
  end: z.custom<ZonedDateTime>(),
  notes: z.string().default(''),

  projectId: z.optional(z.string()),
});
export const draftSchema = timeSchema.pick({
  type: true,
  start: true,
  notes: true,
  projectId: true,
});
export const schema = z.union([timeSchema, draftSchema]);

export type Schema = z.infer<typeof schema>;
