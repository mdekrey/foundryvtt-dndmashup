import { FeatureBonus } from 'src/module/bonuses';
import { MashupItem } from '../../mashup-item';

export class MashupItemRace extends MashupItem<'race'> {
	override allGrantedBonuses(): FeatureBonus[] {
		return [
			{
				target: 'speed',
				amount: this.data.data.baseSpeed,
				type: 'racial',
				condition: '',
			},
			...Object.values(this.data.data.grantedBonuses),
		];
	}
}
