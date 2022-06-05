import type { PropertiesToSource } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import type { BaseItem } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs/baseItem';
import type {
	ItemDataBaseProperties,
	ItemDataConstructorData,
	ItemDataSchema,
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData';
import { TypedData } from 'src/types/types';
import EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs';
import { PossibleItemData } from './types';

const fields = foundry.data.fields;

export type ItemData<TData, TSource extends TypedData<string, unknown>> = foundry.abstract.DocumentData<
	ItemDataSchema,
	ItemDataBaseProperties & TData,
	PropertiesToSource<ItemDataBaseProperties> & TSource,
	ItemDataConstructorData,
	BaseItem
> &
	ItemDataBaseProperties &
	TData;

export class MashupItemData<TItem extends PossibleItemData>
	extends foundry.abstract.DocumentData<
		ItemDataSchema,
		ItemDataBaseProperties,
		PropertiesToSource<ItemDataBaseProperties>,
		ItemDataConstructorData,
		BaseItem
	>
	implements ItemDataBaseProperties
{
	name!: string;
	type!: TItem['type'];
	img!: string | null;
	data!: TItem['data'];
	effects!: EmbeddedCollection<typeof ActiveEffect, foundry.data.ItemData>;
	folder!: string | null;
	sort!: number;
	permission!: Partial<Record<string, 0 | 1 | 2 | 3>>;
	flags!: Record<string, unknown>;

	static defineSchema() {
		return {
			_id: fields.DOCUMENT_ID,
			name: fields.REQUIRED_STRING,
			type: {
				type: String,
				required: true as const,
				validate: (t: string) => foundry.documents.BaseItem.metadata.types.includes(t),
				validationError: 'The provided Item type must be in the array of types defined by the game system',
			},
			img: fields.field(fields.IMAGE_FIELD, { default: () => this.DEFAULT_ICON }),
			data: fields.systemDataField({ documentName: 'Item' }),
			effects: fields.embeddedCollectionField(foundry.documents.BaseActiveEffect),
			// items: fields.embeddedCollectionField(foundry.documents.BaseItem),
			folder: fields.foreignDocumentField({ type: foundry.documents.BaseFolder }),
			sort: fields.INTEGER_SORT_FIELD,
			permission: fields.DOCUMENT_PERMISSIONS,
			flags: fields.OBJECT_FIELD,
		};
	}

	/* ---------------------------------------- */

	/**
	 * The default icon used for newly created Item documents
	 * @type {string}
	 */
	static DEFAULT_ICON = 'icons/svg/hazard.svg';

	/* ---------------------------------------- */

	/** @inheritdoc */
	_initializeSource(data: ItemDataConstructorData) {
		const source = super._initializeSource(data);
		const model = deepClone((game as Game).system.model.Item[data.type]);
		source.data = mergeObject(model || {}, data.data || {});
		return source;
	}
}
