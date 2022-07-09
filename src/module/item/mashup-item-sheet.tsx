import { MashupItem, MashupItemBase } from './mashup-item';
import { PossibleItemData, PossibleItemType } from './types';
import { ClassSheet } from './subtypes/class/ClassSheet';
import { EquipmentSheet } from './subtypes/equipment/EquipmentSheet';
import { RaceSheet } from './subtypes/race/RaceSheet';
import { FeatureSheet } from './subtypes/feature/FeatureSheet';
import { ReactApplicationMixin } from 'src/core/react';
import { DropData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/data/abstract/client-document';
import { EpicDestinySheet } from './subtypes/epicDestiny/EpicDestinySheet';
import { ParagonPathSheet } from './subtypes/paragonPath/ParagonPathSheet';
import { PowerSheet } from './subtypes/power/PowerSheet';
import { ItemDocumentByType } from './item-data-types-template';
import { documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';

const sheets: { [K in PossibleItemType]: React.FC<{ item: ItemDocumentByType[K] }> } = {
	class: ({ item }) => <ClassSheet items={item.items.contents} {...documentAsState(item)} />,
	race: ({ item }) => <RaceSheet items={item.items.contents} {...documentAsState(item)} />,
	equipment: EquipmentSheet,
	feature: FeatureSheet,
	epicDestiny: EpicDestinySheet,
	paragonPath: ParagonPathSheet,
	power: PowerSheet,
};

function ItemSheetJsx({ sheet }: { sheet: MashupItemSheet }) {
	const item = sheet.item;
	const Sheet = sheets[item.type] as React.FC<{ item: MashupItem }>;

	return <Sheet item={item} />;
}

export class MashupItemSheet extends ReactApplicationMixin<typeof ItemSheet>(ItemSheet) {
	static override get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: [],
			width: 585,
			height: 420,
			dragDrop: [{ dragSelector: null, dropSelector: null }],
		});
	}

	protected override _getJsx(): JSX.Element {
		return <ItemSheetJsx sheet={this} />;
	}

	protected override _canDragDrop(selector: string): boolean {
		console.log(super._canDragDrop(selector));
		return true;
	}

	protected override _onDrop(event: DragEvent): void {
		super._onDrop(event);
		if (!this.item.isOwner) return;
		const data = getDragEventData(event);

		switch (data.type) {
			case 'Item':
				return void this._onDropItem(event, data);
		}
	}
	protected async _onDropItem(event: DragEvent, data: DropData<MashupItemBase>) {
		const item = await MashupItemBase.fromDropData(data);
		if (!item) return;
		const itemData = item.toObject() as never as PossibleItemData;

		if (item.parent?.id && item.parent?.id == this.item.parent?.id) return this._onSortItem(event, itemData);

		return this._onDropItemCreate(itemData);
	}
	protected _onDropItemCreate(itemData: PossibleItemData) {
		if (!this.item.canEmbedItem(itemData.type)) return;
		// TODO: filter for sub item type
		return this.item.createEmbeddedDocuments('Item', itemData instanceof Array ? itemData : [itemData]);
	}

	_onSortItem(event: DragEvent, itemData: PossibleItemData) {
		// TODO - see ActorSheet.prototype._onSortItem
		console.log(event, itemData);
	}
}

function getDragEventData(event: DragEvent) {
	try {
		return JSON.parse(event.dataTransfer?.getData('text/plain') ?? '{}');
	} catch (err) {
		return {};
	}
}
