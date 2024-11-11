export interface Time {
  id: string;

  start: string;
  end: string;

  notes: string;
}

export type DraftTime = Omit<Time, 'id' | 'end'>;
