import { FeatureBonus } from 'src/module/bonuses';
import { MashupItem } from '../../mashup-item';
import { SpecificItemEquipmentData, PossibleItemType } from '../../types';
import { ItemSlot, ItemSlotInfo, itemSlots, ItemSlotTemplate } from './item-slots';

export class MashupItemEquipment<TItemSlot extends ItemSlot = ItemSlot> extends MashupItem<'equipment'> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data!: SpecificItemEquipmentData<TItemSlot>;
	override allGrantedBonuses(): FeatureBonus[] {
		return [
			// TODO: only if equipped and it requires an item slot
			...this.data.data.grantedBonuses,
		];
	}

	get itemSlotInfo(): ItemSlotInfo<TItemSlot> {
		return itemSlots[this.data.data.itemSlot] as ItemSlotInfo<TItemSlot>;
	}
	get equipmentProperties(): ItemSlotTemplate<TItemSlot> {
		return (this.data.data.equipmentProperties ?? {
			...this.itemSlotInfo.defaultEquipmentInfo,
		}) as ItemSlotTemplate<TItemSlot>;
	}

	override canEmbedItem(type: PossibleItemType): boolean {
		// TODO - conly contain other equipment if it is a "container"
		return type === 'equipment' || type === 'power';
	}
}
