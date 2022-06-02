import { FeatureBonus } from 'src/module/bonuses';
import { MashupItemBase } from '../../mashup-item-base';
import { SpecificItemEquipmentData } from '../../types';
import { ItemSlot, ItemSlotInfo, itemSlots, ItemSlotTemplate } from './item-slots';

export class MashupItemEquipment<TItemSlot extends ItemSlot = ItemSlot> extends MashupItemBase<'equipment'> {
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
}
