import { ItemDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData';
import { MergeObjectOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/utils/helpers.mjs';
import { FeatureBonus } from '../bonuses';
import { PossibleItemData, PossibleItemType, SpecificItemData } from './types';
import { expandObjectsAndArrays } from 'src/core/foundry/expandObjectsAndArrays';
import { MashupItemData } from './mashup-item-data';

export abstract class MashupItemBase extends Item {
	static override get schema() {
		return MashupItemData as never;
	}

	data!: PossibleItemData;
	abstract allGrantedBonuses(): FeatureBonus[];
	get type(): PossibleItemType {
		return super.type as PossibleItemType;
	}

	override update(
		data?: DeepPartial<ItemDataConstructorData | (ItemDataConstructorData & Record<string, unknown>)>,
		context?: DocumentModificationContext & MergeObjectOptions
	): Promise<this | undefined> {
		return super.update(expandObjectsAndArrays(data as Record<string, unknown>) as never, context);
	}
}

export abstract class MashupItem<T extends PossibleItemType = PossibleItemType> extends MashupItemBase {
	data!: SpecificItemData<T>;
	get type(): T {
		return super.type as T;
	}
}
