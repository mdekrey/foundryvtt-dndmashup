import { FeatureBonus } from 'src/module/bonuses';
import { MashupItemBase } from '../mashup-item-base';

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
