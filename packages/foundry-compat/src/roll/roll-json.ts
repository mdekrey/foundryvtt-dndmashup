export type RollJson = {
	formula: string;
	total: number | undefined;
	evaluated: boolean;
	terms: {
		class: string;
		faces?: number;
		results?: { result: number; active: boolean }[];
	}[];
};
