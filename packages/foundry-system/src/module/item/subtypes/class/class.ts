import { FeatureBonus } from 'dndmashup-react/src/module/bonuses';
import { ClassDocument } from 'dndmashup-react/src/module/item/subtypes/class/dataSourceData';
import { MashupItem } from '../../mashup-item';
import { PossibleItemType } from '../../types';

export class MashupItemClass extends MashupItem<'class'> implements ClassDocument {
	override canEmbedItem(type: PossibleItemType): boolean {
		return type === 'feature' || type === 'power';
	}
	override allGrantedBonuses(): FeatureBonus[] {
		return [
			{
				target: 'maxHp',
				amount: `${this.data.data.hpBase} + ${this.data.data.hpPerLevel} * @actor.extraLevels`,
				type: 'class',
				condition: '',
			},
			{
				target: 'surges-max',
				amount: this.data.data.healingSurgesBase,
				type: 'class',
				condition: '',
			},
			...this.data.data.grantedBonuses,
		];
	}
}
