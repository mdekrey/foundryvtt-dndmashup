import { FeatureBonus } from '../bonuses';
import { PossibleItemData, SpecificItemData } from './types';

export class MashupItemBaseBase extends Item {
	allGrantedBonuses(): FeatureBonus[] {
		return [];
	}
}

export abstract class MashupItemBase<
	T extends PossibleItemData['type'] = PossibleItemData['type']
> extends MashupItemBaseBase {
	data!: SpecificItemData<T>;
	get type(): T {
		return super.type as T;
	}

	allGrantedBonuses(): FeatureBonus[] {
		return [];
	}
}
