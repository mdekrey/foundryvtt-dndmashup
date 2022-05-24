import { FeatureBonus } from 'src/module/bonuses';
import { SubItemFunctions } from './sub-item-functions';

type SheetDataInput = {
	healingSurgesBase: number;
	grantedBonuses: FeatureBonus[];
};

export const classConfig: SubItemFunctions<'class', SheetDataInput> = {
	bonuses: (data) => [
		{
			target: 'maxHp',
			amount: `${data.data.hpBase} + ${data.data.hpPerLevel} * @actor.extraLevels`,
			type: 'class',
		},
		// {
		// 	target: 'surges-max',
		// 	amount: data.data.healingSurgesBase,
		// 	type: 'class',
		// },
	],
	prepare: () => {
		// nothing to prepare
	},
	sheetData: (itemData) => {
		const grantedBonuses = foundry.utils.deepClone(itemData.data.grantedBonuses);
		const surgesBonus = grantedBonuses.find(
			(b) => b.target === 'surges-max' && b.type === 'class' && b.condition === undefined && !b.disabled
		);

		return {
			healingSurgesBase: surgesBonus?.amount ? Number(surgesBonus?.amount) : 0,
			grantedBonuses: grantedBonuses.filter((b) => b !== surgesBonus),
		};
	},
	sheetDataConvert: ({ healingSurgesBase, grantedBonuses, ...data }) => {
		data.data.grantedBonuses = Array.from(Object.values(grantedBonuses || {}));
		data.data.grantedBonuses.push({
			target: 'surges-max',
			amount: healingSurgesBase,
			type: 'class',
		});

		return data;
	},
};
