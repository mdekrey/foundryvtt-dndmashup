import { FeatureBonus } from '@foundryvtt-dndmashup/mashup-react';
import { RaceDocument } from '@foundryvtt-dndmashup/mashup-react';
import { MashupItem } from '../../mashup-item';
import { PossibleItemType } from '../../types';

export class MashupItemRace extends MashupItem<'race'> implements RaceDocument {
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
