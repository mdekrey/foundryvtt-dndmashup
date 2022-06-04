import { ItemDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData';
import { MergeObjectOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/utils/helpers.mjs';
import { FeatureBonus } from '../bonuses';
import { PossibleItemType, SpecificItemData } from './types';

export abstract class MashupItemBase extends Item {
	abstract allGrantedBonuses(): FeatureBonus[];
	get type(): PossibleItemType {
		return super.type as PossibleItemType;
	}

	override async update(
		data?: DeepPartial<ItemDataConstructorData | (ItemDataConstructorData & Record<string, unknown>)>,
		context?: DocumentModificationContext & MergeObjectOptions
	): Promise<this | undefined> {
		return await super.update(data, context);
	}
}

export abstract class MashupItem<T extends PossibleItemType = PossibleItemType> extends MashupItemBase {
	data!: SpecificItemData<T>;
	get type(): T {
		return super.type as T;
	}
}
