export interface Time {
  id: string;

  start: string;
  end: string;
  duration?: number;

  notes: string;

  projectId?: string;
}

export type DraftTime = Omit<Time, 'id' | 'end'>;
