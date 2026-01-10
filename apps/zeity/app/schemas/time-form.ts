import type { ZonedDateTime } from '@internationalized/date';
import { nanoid } from 'nanoid';
import {
  type infer as ZodInfer,
  object,
  string,
  _default,
  custom,
  union,
  optional,
  pick,
} from 'zod/mini';

export const timeSchema = object({
  id: _default(string(), () => nanoid()),
  start: custom<ZonedDateTime>(),
  end: custom<ZonedDateTime>(),
  notes: _default(string(), ''),

  projectId: optional(string()),
});
export const draftSchema = pick(timeSchema, {
  start: true,
  notes: true,
  projectId: true,
});
export const schema = union([timeSchema, draftSchema]);

export type Schema = ZodInfer<typeof schema>;
