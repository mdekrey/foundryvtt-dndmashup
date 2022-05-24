import { SubItemFunctions } from './sub-item-functions';

export const equipmentConfig: SubItemFunctions<'equipment'> = {
	bonuses: () => [],
	prepare: () => {
		// nothing to prepare
	},
	sheetData: (data) => ({
		totalWeight: data.data.weight * data.data.quantity,
		itemSlots: {
			body: 'Body',
			armor: 'Armor',
		},
	}),
};
