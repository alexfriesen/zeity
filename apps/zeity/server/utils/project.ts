import { eq } from '@zeity/database';
import { projects } from '@zeity/database/project';

export function doesProjectExist(projectId: string): Promise<boolean> {
  return useDrizzle()
    .select({ id: projects.id })
    .from(projects)
    .where(eq(projects.id, projectId))
    .then((res) => res[0]?.id === projectId);
}

export function findProjectById(projectId: string) {
  return useDrizzle()
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1)
    .then((res) => res[0]);
}
