import { FeatureBonus } from 'src/module/bonuses';
import { MashupItemBase } from '../mashup-item-base';

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
