export type TermJson = {
	class: string;
	faces?: number;
	results?: { result: number; active: boolean }[];
};

export type RollJson = {
	formula: string;
	total: number | undefined;
	evaluated: boolean;
	dice: TermJson[];
	terms: TermJson[];
};
