import { MashupItem } from './mashup-item';
import { itemMappings } from './subtypes';
import { PossibleItemType } from './types';
import { ClassSheet } from './subtypes/class/ClassSheet';
import { EquipmentSheet } from './subtypes/equipment/EquipmentSheet';
import { RaceSheet } from './subtypes/race/RaceSheet';
import { FeatureSheet } from './subtypes/feature/FeatureSheet';
import { ReactSheetMixin } from 'src/components/sheet/react-sheet-mixin';

const sheets: { [K in PossibleItemType]: React.FC<{ item: InstanceType<typeof itemMappings[K]> }> } = {
	class: ClassSheet,
	race: RaceSheet,
	equipment: EquipmentSheet,
	feature: FeatureSheet,
};

function ItemSheetJsx({ sheet }: { sheet: MashupItemSheet }) {
	const item = sheet.item;
	const Sheet = sheets[item.type] as React.FC<{ item: MashupItem }>;

	return <Sheet item={item} />;
}

export class MashupItemSheet extends ReactSheetMixin<typeof ItemSheet>(ItemSheet) {
	static override get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: [],
			width: 585,
			height: 420,
			dragDrop: [{ dragSelector: null, dropSelector: null }],
			tabs: [
				{
					navSelector: `nav[data-group='primary']`,
					contentSelector: 'section[data-tab-section]',
					initial: 'description',
				},
			],
		});
	}

	protected override _getJsx(): JSX.Element {
		return <ItemSheetJsx sheet={this} />;
	}

	// TODO: collections
	// protected override _canDragDrop(selector: string): boolean {
	// 	console.log(super._canDragDrop(selector));
	// 	return true;
	// }

	// protected override _onDrop(event: DragEvent) {
	// 	super._onDrop(event);
	// 	if (!this.item.isOwner) return;
	// 	const data = getDragEventData(event);

	// 	// TODO: get item from data
	// 	// TODO: filter for sub item type
	// 	// TODO: this.item.createEmbeddedDocuments (see _onDropItemCreate)
	// 	// this.item.toObject()
	// 	switch (data.type) {
	// 		case 'Item':
	// 			return this._onDropItem(event, data);
	// 		// case "Folder":
	// 		//   return this._onDropFolder(event, data);
	// 	}
	// }

	// // eslint-disable-next-line @typescript-eslint/no-explicit-any
	// async _onDropItem(event: DragEvent, data: any) {
	// 	const item = await Item.fromDropData(data);
	// 	if (!item) return;
	// 	const itemData = item.toObject();
	// 	console.log(item, itemData);

	// 	// Handle item sorting within the same Actor
	// 	if ((item.parent as foundry.abstract.Document<never>)?.id === this.id) return this._onSortItem(event, itemData);

	// 	return this._onDropItemCreate(itemData);
	// }

	// async _onDropItemCreate(itemData: Record<string, unknown> | Record<string, unknown>[]) {
	// 	return this.item.createEmbeddedDocuments('Item', itemData instanceof Array ? itemData : [itemData]);
	// }

	// TODO: collections
	// // eslint-disable-next-line @typescript-eslint/no-explicit-any
	// _onSortItem(event: DragEvent, itemData: any) {
	// 	// Get the drag source and its siblings
	// 	const source = this.item.items.get(itemData._id);
	// 	if (!source) return;
	// 	const siblings = this.item.items.filter((i) => {
	// 		return i.data.type === source.data.type && i.data._id !== source.data._id;
	// 	});

	// 	// Get the drop target
	// 	const dropTarget = (event.target as HTMLElement).closest('[data-item-id]');
	// 	const targetId = dropTarget ? (dropTarget as HTMLElement).dataset.itemId : null;
	// 	const target = siblings.find((s) => s.data._id === targetId);

	// 	// Ensure we are only sorting like-types
	// 	if (target && source.data.type !== target.data.type) return;

	// 	// Perform the sort
	// 	const sortUpdates = SortingHelpers.performIntegerSort(source, { target: target, siblings });
	// 	const updateData = sortUpdates.map((u) => {
	// 		const update = u.update;
	// 		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// 		(update as any)._id = u.target.data._id;
	// 		return update;
	// 	});

	// 	// Perform the update
	// 	return this.actor.updateEmbeddedDocuments('Item', updateData);
	// }
}

function getDragEventData(event: DragEvent) {
	if (!('dataTransfer' in event)) {
		// Clumsy because (event instanceof DragEvent) doesn't work
		console.warn('Incorrectly attempted to process drag event data for an event which was not a DragEvent.');
		return {};
	}
	try {
		return JSON.parse(event.dataTransfer?.getData('text/plain') ?? '{}');
	} catch (err) {
		return {};
	}
}
