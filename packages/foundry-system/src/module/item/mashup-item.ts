import { ItemDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData';
import { MergeObjectOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/utils/helpers.mjs';
import {
	DynamicListEntryWithSource,
	FeatureBonusWithSource,
	SourcedAura,
	SourcedPoolBonus,
	SourcedPoolLimits,
	SourcedTriggeredEffect,
} from '@foundryvtt-dndmashup/mashup-rules';
import {
	isPower,
	ItemDocument,
	PossibleItemDataSource,
	PossibleItemSystemData,
	SpecificItemDataSource,
	SpecificItemSystemData,
} from '@foundryvtt-dndmashup/mashup-react';
import { PossibleItemType } from './types';
import { expandObjectsAndArrays } from '../../core/foundry/expandObjectsAndArrays';
import Document, {
	Metadata,
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs';
import { DocumentConstructor } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import { AnyDocumentData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/data.mjs';
import EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs';
import type { PowerDocument } from '@foundryvtt-dndmashup/mashup-react';
import { SimpleDocument, SimpleDocumentData, TypedData } from '@foundryvtt-dndmashup/foundry-compat';

export type MashupItemBaseType = typeof MashupItemBase & (new (...args: any[]) => MashupItemBase);

const itemCollectionPath = 'system.items';

export class MashupItemBase extends Item implements ItemDocument {
	// TODO: schema support doesn't seem to be working in v9
	// static override get schema() {
	// 	return MashupItemData as any;
	// }

	_source!: any;
	system!: PossibleItemSystemData;

	get displayName(): string | null {
		return this._source.name;
	}

	allGrantedBonuses(): FeatureBonusWithSource[] {
		return [];
	}
	allDynamicList(): DynamicListEntryWithSource[] {
		return [];
	}
	allGrantedPowers(): PowerDocument[] {
		return [];
	}
	allGrantedPools(): SourcedPoolLimits[] {
		return [];
	}
	allGrantedPoolBonuses(): SourcedPoolBonus[] {
		return [];
	}
	allGrantedAuras(): SourcedAura[] {
		return [];
	}
	allTriggeredEffects(): SourcedTriggeredEffect[] {
		return [];
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	canEmbedItem(type: PossibleItemType) {
		return false;
	}

	private _items: EmbeddedCollection<MashupItemBaseType, AnyDocumentData> | undefined = undefined;
	get items(): EmbeddedCollection<MashupItemBaseType, AnyDocumentData> {
		return this._items ?? (this._items = this.createEmbeddedItemsCollection());
	}
	private createEmbeddedItemsCollection(): EmbeddedCollection<MashupItemBaseType, AnyDocumentData> {
		return new foundry.fixup.EmbeddedCollection(
			this,
			(this.system.items ?? []) as never as ItemDataConstructorData[],
			CONFIG.Item.documentClass
		);
	}

	override async createEmbeddedDocuments(embeddedName: any, data: any, context?: any): Promise<any> {
		if (embeddedName !== 'Item') return super.createEmbeddedDocuments(embeddedName, data, context);
		if (!Array.isArray(data)) data = [data];
		const currentItems = [...(this.system.items ?? [])];

		if (data.length) {
			for (const itemData of data) {
				const theItem = new CONFIG.Item.documentClass(
					{ ...itemData, _id: randomID() },
					{ parent: this as never /* Foundry officially requires parents to be actors */ }
				);
				if (!theItem) continue;
				const theData = theItem.toJSON();
				currentItems.push(theData as never);
			}
			if (this.parent)
				return this.parent.updateEmbeddedDocuments('Item', [{ _id: this.id, [itemCollectionPath]: currentItems }]);
			else MashupItemBase.setCollection(this, currentItems);
		}
	}

	override get isEmbedded() {
		// TODO - there was something different here in itemcontainer that checked documentname
		if (this.parent === null) return false;
		return this.parent !== null;
	}

	override getEmbeddedDocument(
		embeddedName: string,
		id: string,
		options?: { strict?: boolean | undefined }
	): Document<any, this, Metadata<any>> | undefined {
		if (embeddedName === 'Item') return this.items.get(id) as never;
		return super.getEmbeddedDocument(embeddedName, id, options);
	}

	override async updateEmbeddedDocuments(
		embeddedName: string,
		updates?: Record<string, unknown>[],
		context?: DocumentModificationContext
	): Promise<Document<any, this, Metadata<any>>[]> {
		if (embeddedName !== 'Item') return super.updateEmbeddedDocuments(embeddedName, updates, context);
		const contained = this.system.items ?? [];
		const allUpdates = Array.isArray(updates) ? updates : updates ? [updates] : [];
		const updated: any[] = [];
		const newContained = contained.map((existing): PossibleItemDataSource => {
			const theUpdate = allUpdates.find((update) => update['_id'] === existing._id);
			if (theUpdate) {
				const newData = mergeObject(theUpdate, existing, {
					overwrite: false,
					insertKeys: true,
					insertValues: true,
					inplace: false,
				}) as never as PossibleItemDataSource;
				updated.push(newData);
				return newData;
			}
			return existing as PossibleItemDataSource;
		});

		if (updated.length > 0) {
			if (this.parent) {
				await this.parent.updateEmbeddedDocuments('Item', [{ _id: this.id, [itemCollectionPath]: newContained }]);
			} else {
				await MashupItemBase.setCollection(this, newContained);
			}

			if (this.sheet) {
				this.render(false);
			}
		}
		return updated;
	}

	// async updateDocuments(wrapped, updates = [], context = { parent: {}, pack: {}, options: {} }) {
	// 	const { parent, pack, options } = context;
	// 	// An item whose parent is an item only exists in the parents embedded documents
	// 	if (!(parent instanceof Item && parent.type !== 'backpack')) return wrapped(updates, context);
	// 	//@ts-ignore updateEmbeddedDocuments
	// 	return parent.updateEmbeddedDocuments('Item', updates, options);
	// }

	static async setCollection(item: MashupItemBase, contents: TypedData<string, unknown>[]) {
		item.update({ [itemCollectionPath]: duplicate(contents) });
	}

	override async deleteEmbeddedDocuments(
		embeddedName: string,
		ids: string[],
		context?: DocumentModificationContext
	): Promise<Document<any, this, Metadata<any>>[]> {
		if (embeddedName !== 'Item') return super.deleteEmbeddedDocuments(embeddedName, ids, context);
		const containedItems = this.system.items;
		const newContained = containedItems.filter((itemData) => !ids.includes(itemData._id));
		const deletedItems = this.items.filter((item) => (item.id ? ids.includes(item.id) : false));
		if (this.parent) {
			await this.parent.updateEmbeddedDocuments('Item', [{ _id: this.id, [itemCollectionPath]: newContained }]);
		} else {
			await MashupItemBase.setCollection(this, newContained);
		}
		return deletedItems as never;
	}

	//   export async function deleteDocuments(wrapped, ids=[], context={parent: {}, pack: {}, options: {}}) {
	// 	const {parent, pack, options} = context;
	// 	if (!(parent instanceof Item && parent.type === "backpack")) return wrapped(ids, context);
	// 	// an Item whose parent is an item only exists in the embedded documents
	// 	//@ts-ignore
	// 	return parent.deleteEmbeddedDocuments("Item", ids)
	//   }

	override getEmbeddedCollection(embeddedName: string): EmbeddedCollection<DocumentConstructor, AnyDocumentData> {
		if (embeddedName === 'Item') return this.items;
		return super.getEmbeddedCollection(embeddedName);
	}

	override async prepareEmbeddedDocuments() {
		if (!this.parent) {
			// TODO: Managing embedded Documents which are not direct descendants of a primary Document is un-supported at this time.
			super.prepareEmbeddedDocuments();
		}
		const containedItems = this.system.items ?? [];

		const items = this.items;
		const oldIds = items.contents
			.map((c) => c._source._id)
			.filter((id) => !containedItems.some((item) => item._id === id));
		oldIds.forEach((id) => items.delete(id, {}));
		for (const idata of containedItems) {
			const currentItem = items.get(idata._id);
			if (!currentItem) {
				const theItem = new CONFIG.Item.documentClass(idata as never as ItemDataConstructorData, {
					parent: this as never /* Foundry officially requires parents to be actors */,
				});
				if (theItem) items.set(idata._id, theItem, {});
			} else {
				// TODO see how to avoid this - here to make sure the contained items is correctly setup
				// FIXME: Foundry 10 types: updateSource is added in Foundry 10
				(currentItem as any).updateSource(idata, {});
				this.items.set(idata._id, currentItem, {});
				currentItem.render(false);
			}
		}
	}

	override async update(
		data?: DeepPartial<ItemDataConstructorData | (ItemDataConstructorData & Record<string, unknown>)>,
		context?: DocumentModificationContext & MergeObjectOptions
	): Promise<this | undefined> {
		// TODO: For Foundry v9, this is necessary. This appears to be fixed in v10
		data = expandObjectsAndArrays(data as Record<string, unknown>) as ItemDataConstructorData;
		if (!(this.parent instanceof Item)) return super.update(data, context);
		const resultData = {
			...(expandObjectsAndArrays(data as Record<string, unknown>) as Record<string, unknown>),
			_id: this.id,
		};
		await (this.parent as MashupItemBase).updateEmbeddedDocuments('Item', [resultData]);
		this.render(false);
		return this;
	}

	override async delete(context?: DocumentModificationContext): Promise<this | undefined> {
		if (!(this.parent instanceof MashupItemBase)) return super.delete(context);
		if (this.id) await (this.parent as MashupItemBase).deleteEmbeddedDocuments('Item', [this.id]);
		if (this.sheet) this.sheet.close({ submit: false });
		return this;
	}

	showEditDialog() {
		this.sheet?.render(true, { focus: true });
	}
}

export abstract class MashupItem<T extends PossibleItemType = PossibleItemType>
	extends MashupItemBase
	implements SimpleDocument<SpecificItemDataSource<T>>
{
	override data!: never;
	override _source!: SimpleDocumentData<SpecificItemDataSource<T>>;
	override system!: SpecificItemSystemData<T>;

	abstract override allGrantedBonuses(): FeatureBonusWithSource[];
	abstract override allDynamicList(): DynamicListEntryWithSource[];
	abstract override allGrantedPools(): SourcedPoolLimits[];
	abstract override allGrantedPoolBonuses(): SourcedPoolBonus[];
	abstract override allGrantedAuras(): SourcedAura[];
	abstract override allTriggeredEffects(): SourcedTriggeredEffect[];
	override allGrantedPowers(): PowerDocument[] {
		return [
			...(this.items.contents as SimpleDocument[]).filter(isPower),
			...this.items.contents.filter((i) => !isPower(i)).flatMap((item) => item.allGrantedPowers()),
		];
	}
	abstract override canEmbedItem(type: PossibleItemType): boolean;
}
