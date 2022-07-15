import { EquipmentData, EquipmentDocument } from 'dndmashup-react/src/module/item/subtypes/equipment/dataSourceData';
import { FeatureBonus } from 'dndmashup-react/src/module/bonuses';
import { PossibleItemType } from 'dndmashup-react/src/module/item/item-data-types-template';
import { MashupItem } from '../../mashup-item';
import { SpecificItemEquipmentData } from '../../types';
import { ItemSlot } from 'dndmashup-react/src/module/item/subtypes/equipment/item-slots';

export class MashupItemEquipment<TItemSlot extends ItemSlot = ItemSlot>
	extends MashupItem<'equipment'>
	implements EquipmentDocument<TItemSlot>
{
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data!: SpecificItemEquipmentData<TItemSlot> & EquipmentData<TItemSlot>;
	override allGrantedBonuses(): FeatureBonus[] {
		return [
			// TODO: only if equipped and it requires an item slot
			...this.data.data.grantedBonuses,
		];
	}

	override canEmbedItem(type: PossibleItemType): boolean {
		// TODO - conly contain other equipment if it is a "container"
		return type === 'equipment' || type === 'power';
	}
}
