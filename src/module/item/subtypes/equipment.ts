import { SubItemFunctions } from './sub-item-functions';

export const equipmentConfig: SubItemFunctions<'equipment'> = {
	bonuses: (data) => [
		// TODO: only if equipped and it requires an item slot
		...data.data.grantedBonuses,
	],
	prepare: () => {
		// nothing to prepare
	},
};
