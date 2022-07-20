import { EquipmentData, EquipmentDocument } from '@foundryvtt-dndmashup/mashup-react';
import { FeatureBonus } from '@foundryvtt-dndmashup/mashup-react';
import { PossibleItemType } from '@foundryvtt-dndmashup/mashup-react';
import { MashupItem } from '../../mashup-item';
import { SpecificItemEquipmentData } from '../../types';
import { ItemSlot } from '@foundryvtt-dndmashup/mashup-react';

export class MashupItemEquipment<TItemSlot extends ItemSlot = ItemSlot>
	extends MashupItem<'equipment'>
	implements EquipmentDocument<TItemSlot>
{
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	override data!: SpecificItemEquipmentData<TItemSlot> & EquipmentData<TItemSlot>;
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
