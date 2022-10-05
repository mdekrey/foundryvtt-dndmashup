import {
	DynamicListEntryWithSource,
	FeatureBonusWithSource,
	SourcedAura,
	SourcedPoolBonus,
	SourcedPoolLimits,
	SourcedTriggeredEffect,
} from '@foundryvtt-dndmashup/mashup-rules';
import { EquipmentDocument, itemSlots, PossibleItemType } from '@foundryvtt-dndmashup/mashup-react';
import { MashupItem } from '../../mashup-item';
import { SpecificItemEquipmentDataSource, SpecificItemEquipmentSystemData } from '../../types';
import { ItemSlot } from '@foundryvtt-dndmashup/mashup-react';
import { SimpleDocumentData } from '@foundryvtt-dndmashup/foundry-compat';

export class MashupItemEquipment<TItemSlot extends ItemSlot = ItemSlot>
	extends MashupItem<'equipment'>
	implements EquipmentDocument<TItemSlot>
{
	override _source!: SimpleDocumentData<SpecificItemEquipmentDataSource<TItemSlot>>;
	override system!: SpecificItemEquipmentSystemData<TItemSlot>;

	override get displayName() {
		if (this.system.quantity !== 1) {
			return `${this.name} x${this.system.quantity}`;
		}
		return this.name;
	}

	override allGrantedBonuses(isForPowerUse?: boolean): FeatureBonusWithSource[] {
		if (!this.canApplyBonuses(isForPowerUse)) return [];
		return [
			...itemSlots[this.system.itemSlot].bonuses(this.system.equipmentProperties as never),
			...this.system.grantedBonuses,
		].map((b) => ({ ...b, source: this }));
	}
	override allDynamicList(isForPowerUse?: boolean): DynamicListEntryWithSource[] {
		if (!this.canApplyBonuses(isForPowerUse)) return [];
		return this.system.dynamicList.map((b) => ({ ...b, source: this }));
	}
	override allGrantedPools(): SourcedPoolLimits[] {
		return [];
	}
	override allGrantedPoolBonuses(): SourcedPoolBonus[] {
		if (!this.canApplyBonuses()) return [];
		return this.system.grantedPoolBonuses ? this.system.grantedPoolBonuses.map((b) => ({ ...b, source: this })) : [];
	}

	override canEmbedItem(type: PossibleItemType): boolean {
		return (this.system.container && type === 'equipment') || type === 'power';
	}

	private canApplyBonuses(isForPowerUse?: boolean) {
		if ((this.system.itemSlot === 'weapon' || this.system.itemSlot === 'implement') && !isForPowerUse) return false;
		if (!this.system.equipped?.length && this.system.itemSlot) return false;
		if (this.parent?.type === 'monster') return false;
		return true;
	}
	override allGrantedAuras(): SourcedAura[] {
		return [
			...this.items.contents.flatMap((item) => item.allGrantedAuras()),
			...(this.system.grantedAuras?.map((b) => ({ ...b, sources: [this] })) ?? []),
		];
	}
	override allTriggeredEffects(): SourcedTriggeredEffect[] {
		return this.items.contents.flatMap((item) => item.allTriggeredEffects());
	}

	async decreaseQuantity(count: number) {
		return this.update({ 'data.quantity': this.system.quantity - count });
	}
}
