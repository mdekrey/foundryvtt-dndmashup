import { SubItemFunctions } from './sub-item-functions';

export const classConfig: SubItemFunctions<'class'> = {
	bonuses: (data) => [
		{
			target: 'maxHp',
			amount: `${data.data.hpBase} + ${data.data.hpPerLevel} * @actor.extraLevels`,
			type: 'class',
		},
		{
			target: 'surges-max',
			amount: data.data.healingSurgesBase,
			type: 'class',
		},
	],
	prepare: () => {
		// nothing to prepare
	},
};
