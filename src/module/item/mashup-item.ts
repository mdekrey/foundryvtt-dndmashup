import { FeatureBonus } from '../bonuses';
import { PossibleItemType, SpecificItemData } from './types';

export class MashupItemBase extends Item {
	allGrantedBonuses(): FeatureBonus[] {
		return [];
	}
}

export abstract class MashupItem<T extends PossibleItemType = PossibleItemType> extends MashupItemBase {
	data!: SpecificItemData<T>;
	get type(): T {
		return super.type as T;
	}

	abstract allGrantedBonuses(): FeatureBonus[];
}
