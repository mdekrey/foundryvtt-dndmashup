export type ArmorCategory = 'cloth' | 'leather' | 'hide' | 'chainmail' | 'scale' | 'plate';
export type ArmorType = 'light' | 'heavy';

export type ArmorItemSlotTemplate = {
	armorBonus: number;
	category: ArmorCategory;
	type: ArmorType;
	checkPenalty: number;
	speedPenalty: number;
};
