import { SubItemFunctions } from './sub-item-functions';

export const raceConfig: SubItemFunctions<'race'> = {
	bonuses: (data) => [
		{
			target: 'speed',
			amount: data.data.baseSpeed,
			type: 'racial',
		},
	],
	prepare: () => {
		// nothing to prepare
	},
};
