import { FeatureBonus } from 'src/module/bonuses';
import { MashupItemBase } from '../mashup-item-base';
import { SubItemFunctions } from './sub-item-functions';

export const raceConfig: SubItemFunctions<'race'> = {
	bonuses: (data) => [
		{
			target: 'speed',
			amount: data.data.baseSpeed,
			type: 'racial',
		},
		...data.data.grantedBonuses,
	],
	prepare: () => {
		// nothing to prepare
	},
};

export class MashupItemRace extends MashupItemBase<'race'> {
	override allGrantedBonuses(): FeatureBonus[] {
		return [
			{
				target: 'speed',
				amount: this.data.data.baseSpeed,
				type: 'racial',
			},
			...this.data.data.grantedBonuses,
		];
	}
}
