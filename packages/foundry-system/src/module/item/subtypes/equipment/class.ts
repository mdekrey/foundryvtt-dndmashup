import { DynamicListEntry, FeatureBonus } from '@foundryvtt-dndmashup/mashup-rules';
import { EquipmentData, EquipmentDocument, PossibleItemType } from '@foundryvtt-dndmashup/mashup-react';
import { MashupItem } from '../../mashup-item';
import { SpecificItemEquipmentData } from '../../types';
import { ItemSlot } from '@foundryvtt-dndmashup/mashup-react';

export class MashupItemEquipment<TItemSlot extends ItemSlot = ItemSlot>
	extends MashupItem<'equipment'>
	implements EquipmentDocument<TItemSlot>
{
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	override data!: SpecificItemEquipmentData<TItemSlot> & EquipmentData<TItemSlot>;
	override allGrantedBonuses(isForPowerUse?: boolean): FeatureBonus[] {
		if ((this.data.data.itemSlot === 'weapon' || this.data.data.itemSlot === 'implement') && !isForPowerUse) return [];
		if (!this.data.data.equipped?.length && this.data.data.itemSlot) return [];
		return [...this.data.data.grantedBonuses];
	}
	override allDynamicList(isForPowerUse?: boolean): DynamicListEntry[] {
		if ((this.data.data.itemSlot === 'weapon' || this.data.data.itemSlot === 'implement') && !isForPowerUse) return [];
		if (!this.data.data.equipped?.length && this.data.data.itemSlot) return [];
		return [...this.data.data.dynamicList];
	}

	override canEmbedItem(type: PossibleItemType): boolean {
		return (this.data.data.container && type === 'equipment') || type === 'power';
	}
}
