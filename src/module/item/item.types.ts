import type { PropertiesToSource } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import type { BaseItem } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs/baseItem';
import type DocumentData from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/data.mjs';
import type {
	ItemDataBaseProperties,
	ItemDataBaseSource,
	ItemDataConstructorData,
	ItemDataSchema,
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData';

export type ItemData<TData, TSource> = DocumentData<
	ItemDataSchema,
	ItemDataBaseProperties & TData,
	PropertiesToSource<ItemDataBaseProperties> & TSource,
	ItemDataConstructorData,
	BaseItem
> &
	ItemDataBaseProperties &
	TData & {
		_initializeSource(data: ItemDataConstructorData): ItemDataBaseSource & TSource;

		_initialize(): void;
	};
