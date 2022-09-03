import {
	DynamicListEntryWithSource,
	FeatureBonusWithSource,
	SourcedAura,
	SourcedPoolBonus,
	SourcedPoolLimits,
} from '@foundryvtt-dndmashup/mashup-rules';
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
	override allGrantedBonuses(isForPowerUse?: boolean): FeatureBonusWithSource[] {
		if (!this.canApplyBonuses(isForPowerUse)) return [];
		return [
			...itemSlots[this.data.data.itemSlot].bonuses(this.data.data.equipmentProperties as never),
			...this.data.data.grantedBonuses,
		].map((b) => ({ ...b, source: this }));
	}
	override allDynamicList(isForPowerUse?: boolean): DynamicListEntryWithSource[] {
		if (!this.canApplyBonuses(isForPowerUse)) return [];
		return this.data.data.dynamicList.map((b) => ({ ...b, source: this }));
	}
	override allGrantedPools(): SourcedPoolLimits[] {
		return [];
	}
	override allGrantedPoolBonuses(): SourcedPoolBonus[] {
		if (!this.canApplyBonuses()) return [];
		return this.data.data.grantedPoolBonuses
			? this.data.data.grantedPoolBonuses.map((b) => ({ ...b, source: this }))
			: [];
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
	override allGrantedAuras(): SourcedAura[] {
		return [
			...this.items.contents.flatMap((item) => item.allGrantedAuras()),
			...(this.data.data.grantedAuras?.map((b) => ({ ...b, source: this })) ?? []),
		];
	}
}
