import { FeatureBonus } from 'src/module/bonuses';
import { MashupItem } from '../../mashup-item';
import { SpecificItemEquipmentData, PossibleItemType } from '../../types';
import { EquipmentData } from './dataSourceData';
import { getEquipmentProperties } from './getEquipmentProperties';
import { getItemSlotInfo, ItemSlot, ItemSlotInfo, ItemSlotTemplate } from './item-slots';

export class MashupItemEquipment<TItemSlot extends ItemSlot = ItemSlot> extends MashupItem<'equipment'> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data!: SpecificItemEquipmentData<TItemSlot> & EquipmentData<TItemSlot>;
	override allGrantedBonuses(): FeatureBonus[] {
		return [
			// TODO: only if equipped and it requires an item slot
			...this.data.data.grantedBonuses,
		];
	}

	get itemSlotInfo(): ItemSlotInfo<TItemSlot> {
		return getItemSlotInfo<TItemSlot>(this.data.data.itemSlot);
	}
	get equipmentProperties(): ItemSlotTemplate<TItemSlot> {
		return getEquipmentProperties<TItemSlot>(this.data);
	}

	override canEmbedItem(type: PossibleItemType): boolean {
		// TODO - conly contain other equipment if it is a "container"
		return type === 'equipment' || type === 'power';
	}
}
