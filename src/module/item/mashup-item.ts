import { ItemSlot, ItemSlotInfo, itemSlots } from './subtypes/equipment/item-slots';
import { itemSubtypeConfig, SubItemFunctions } from './subtypes';
import { PossibleItemData, SpecificItemData, SpecificItemEquipmentData } from './types';

export class MashupItem extends Item {
	data!: PossibleItemData;
	subItemFunctions!: SubItemFunctions<PossibleItemData['type']>;

	override prepareData(): void {
		this.subItemFunctions = itemSubtypeConfig[this.data.type] as typeof this.subItemFunctions;
		super.prepareData();
	}

	allGrantedBonuses() {
		return this.subItemFunctions.bonuses(this.data);
	}

	prepareDerivedData() {
		const allData = this.data;

		// all active effects and other linked objects should be loaded here
		if (allData._source.type !== allData.type) {
			// seriously, wtf?
			console.error('Got two different item types:', allData._source.type, allData.type);
			return;
		}
		this.subItemFunctions.prepare(this as SpecificItem);
	}

	get itemSlotInfo(): null | ItemSlotInfo {
		return this.data.type === 'equipment' ? (itemSlots[this.data.data.itemSlot] as ItemSlotInfo) ?? null : null;
	}
}

export type SpecificItem<T extends PossibleItemData['type'] = PossibleItemData['type']> = MashupItem & {
	data: SpecificItemData<T>;
	readonly itemSlotInfo: T extends 'equipment' ? ItemSlotInfo : null;
};

export type SpecificEquipmentItem<TItemSlot extends ItemSlot = ItemSlot> = SpecificItem<'equipment'> & {
	data: SpecificItemEquipmentData<TItemSlot>;
	readonly itemSlotInfo: ItemSlotInfo<TItemSlot>;
};
