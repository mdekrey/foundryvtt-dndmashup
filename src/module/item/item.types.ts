import type { PropertiesToSource } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import type { BaseItem } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs/baseItem';
import type DocumentData from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/data.mjs';
import type {
	ItemDataBaseProperties,
	ItemDataBaseSource,
	ItemDataConstructorData,
	ItemDataSchema,
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData';
import { DataSource } from 'src/types/types';

export type ItemData<TData, TSource extends DataSource<string, unknown>> = DocumentData<
	ItemDataSchema,
	ItemDataBaseProperties & TData,
	PropertiesToSource<ItemDataBaseProperties> & TSource,
	ItemDataConstructorData,
	BaseItem
> &
	ItemDataBaseProperties &
	TData & {
		_initializeSource(
			data: Omit<ItemDataConstructorData, 'type' | 'data'> & { type: TSource['type']; data?: DeepPartial<TSource> }
		): ItemDataBaseSource & TSource;

		_initialize(): void;
	};
