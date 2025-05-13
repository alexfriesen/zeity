import { eq } from '@zeity/database';
import { times } from '@zeity/database/time';

export function doesTimeExist(timeId: number): Promise<boolean> {
  return useDrizzle()
    .select({ id: times.id })
    .from(times)
    .where(eq(times.id, timeId))
    .then((res) => res[0]?.id === timeId);
}

export function findTimeById(timeId: number) {
  return useDrizzle()
    .select()
    .from(times)
    .where(eq(times.id, timeId))
    .limit(1)
    .then((res) => res[0]);
}
