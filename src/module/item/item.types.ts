import type {
	// TODO: collections
	// ConfiguredDocumentClass,
	PropertiesToSource,
} from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import type { BaseItem } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs/baseItem';
import type DocumentData from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/data.mjs';
import type {
	ItemDataBaseProperties,
	// TODO: collections
	// ItemDataBaseSource,
	ItemDataConstructorData,
	ItemDataSchema,
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData';
import { TypedData } from 'src/types/types';
// TODO: collections
// import EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs';

// TODO: collections
// type EmbeddedDocuments<TData, TSource extends TypedData<string, unknown>> = {
// 	/**
// 	 * A Collection of Item embedded Documents
// 	 * @defaultValue `new EmbeddedCollection(ItemData, [], BaseItem.implementation)`
// 	 */
// 	items: EmbeddedCollection<ConfiguredDocumentClass<typeof foundry.documents.BaseItem>, ItemData<TData, TSource>>;
// };

export type ItemData<TData, TSource extends TypedData<string, unknown>> = DocumentData<
	ItemDataSchema,
	ItemDataBaseProperties & TData,
	PropertiesToSource<ItemDataBaseProperties> & TSource,
	ItemDataConstructorData,
	BaseItem
> &
	ItemDataBaseProperties &
	// TODO: collections
	// EmbeddedDocuments<TData, TSource> &
	TData;

// export class MashupItemSchema extends DocumentData {

// }
