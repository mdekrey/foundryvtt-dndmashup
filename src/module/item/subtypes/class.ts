import { FeatureBonus } from 'src/module/bonuses';
import { MashupItemBase } from '../mashup-item-base';
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
		...data.data.grantedBonuses,
	],
	prepare: () => {
		// nothing to prepare
	},
};

export class MashupItemClass extends MashupItemBase<'class'> {
	override allGrantedBonuses(): FeatureBonus[] {
		return [
			{
				target: 'maxHp',
				amount: `${this.data.data.hpBase} + ${this.data.data.hpPerLevel} * @actor.extraLevels`,
				type: 'class',
			},
			{
				target: 'surges-max',
				amount: this.data.data.healingSurgesBase,
				type: 'class',
			},
			...this.data.data.grantedBonuses,
		];
	}
}
