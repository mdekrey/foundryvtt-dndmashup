import { DynamicListEntry, FeatureBonus, PoolBonus, PoolLimits } from '@foundryvtt-dndmashup/mashup-rules';
import { EquipmentData, EquipmentDocument, itemSlots, PossibleItemType } from '@foundryvtt-dndmashup/mashup-react';
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
		if (!this.canApplyBonuses(isForPowerUse)) return [];
		return [
			...itemSlots[this.data.data.itemSlot].bonuses(this.data.data.equipmentProperties as never),
			...this.data.data.grantedBonuses,
		];
	}
	override allDynamicList(isForPowerUse?: boolean): DynamicListEntry[] {
		if (!this.canApplyBonuses(isForPowerUse)) return [];
		return [...this.data.data.dynamicList];
	}
	override allGrantedPools(): PoolLimits[] {
		return [];
	}
	override allGrantedPoolBonuses(): PoolBonus[] {
		if (!this.canApplyBonuses()) return [];
		return this.data.data.grantedPoolBonuses ? [...this.data.data.grantedPoolBonuses] : [];
	}

	override canEmbedItem(type: PossibleItemType): boolean {
		return (this.data.data.container && type === 'equipment') || type === 'power';
	}

	private canApplyBonuses(isForPowerUse?: boolean) {
		if ((this.data.data.itemSlot === 'weapon' || this.data.data.itemSlot === 'implement') && !isForPowerUse)
			return false;
		if (!this.data.data.equipped?.length && this.data.data.itemSlot) return false;
		return true;
	}
}
