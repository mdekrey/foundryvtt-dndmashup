export type ShieldType = 'light' | 'heavy';
export type ShieldItemSlotTemplate = {
	type: ShieldType;
	shieldBonus: number;
	checkPenalty: number;
};
