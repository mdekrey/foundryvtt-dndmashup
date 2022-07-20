import type { PropertiesToSource } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import type { BaseItem } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs/baseItem';
import {
	ItemDataBaseProperties,
	ItemDataConstructorData,
	ItemDataSchema,
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData';
import EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs';
import { PossibleItemData } from './types';

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

	// TODO: schema support doesn't seem to be working in v9

	/* ---------------------------------------- */

	/**
	 * The default icon used for newly created Item documents
	 * @type {string}
	 */
	static DEFAULT_ICON = 'icons/svg/hazard.svg';

	/* ---------------------------------------- */

	/** @inheritdoc */
	override _initializeSource(data: ItemDataConstructorData) {
		const source = super._initializeSource(data);
		const model = deepClone((game as Game).system.model.Item[data.type]);
		source.data = mergeObject(model || {}, data.data || {});
		return source;
	}
}
