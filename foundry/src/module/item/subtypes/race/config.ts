import { FeatureBonus } from 'src/module/bonuses';
import { MashupItem } from '../../mashup-item';
import { PossibleItemType } from '../../types';

export class MashupItemRace extends MashupItem<'race'> {
	override canEmbedItem(type: PossibleItemType): boolean {
		return type === 'feature' || type === 'power';
	}
	override allGrantedBonuses(): FeatureBonus[] {
		return [
			{
				target: 'speed',
				amount: this.data.data.baseSpeed,
				type: 'racial',
				condition: '',
			},
			...this.data.data.grantedBonuses,
		];
	}
}
