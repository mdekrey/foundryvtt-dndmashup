import { FeatureBonus } from '../bonuses';
import { PossibleItemType, SpecificItemData } from './types';

export abstract class MashupItemBase extends Item {
	abstract allGrantedBonuses(): FeatureBonus[];
	get type(): PossibleItemType {
		return super.type as PossibleItemType;
	}
}

export abstract class MashupItem<T extends PossibleItemType = PossibleItemType> extends MashupItemBase {
	data!: SpecificItemData<T>;
	get type(): T {
		return super.type as T;
	}
}
