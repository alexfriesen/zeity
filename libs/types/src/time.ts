export interface Time {
  id: string | number;

  start: string;
  duration: number;

  notes: string;

  projectId?: string | null;

  userId?: string;
  organisationId?: string;

  createdAt?: string;
  updatedAt?: string;
}

export type DraftTime = Omit<Time, 'id' | 'duration'>;
