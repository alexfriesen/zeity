export interface Time {
	id: string;

	start: string;
	end: string;

	tags: string[];
	notes: string;
}

export type DraftTime = Omit<Time, 'id' | 'end'>;
