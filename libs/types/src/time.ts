export interface Time {
  id: string;
  type?: string;

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
