import {
	SourcedAura,
	DynamicListEntryWithSource,
	FeatureBonusWithSource,
	SourcedPoolBonus,
	SourcedPoolLimits,
	SourcedTriggeredEffect,
} from '@foundryvtt-dndmashup/mashup-rules';
import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { isEquipment, isPower, PowerDocument } from '@foundryvtt-dndmashup/mashup-react';
import { MashupItem } from '../../mashup-item';
import { PossibleItemType } from '../../types';
import { MashupItemEquipment } from '../equipment/class';

export class MashupPower extends MashupItem<'power'> implements PowerDocument {
	override get displayName(): string | null {
		if (this.system.usage === 'item-consumable') {
			if (this.parent instanceof MashupItemEquipment)
				return `${this.name} x${(this.parent as MashupItemEquipment).system.quantity}`;
			else return `${this.name} x0`;
		}
		return this.name;
	}

	override canEmbedItem(type: PossibleItemType): boolean {
		return type === 'power';
	}
	override allGrantedBonuses(): FeatureBonusWithSource[] {
		return [];
	}
	override allDynamicList(): DynamicListEntryWithSource[] {
		return [];
	}
	override allGrantedPools(): SourcedPoolLimits[] {
		return this.system.grantedPools?.map((b) => ({ ...b, source: [this] })) ?? [];
	}
	override allGrantedPoolBonuses(): SourcedPoolBonus[] {
		return [];
	}

	get powerGroupId() {
		const parent: SimpleDocument | null = this.parent;
		if (this.system.usage === 'item' && parent && isEquipment(parent)) {
			return parent.id;
		} else if (parent && isPower(parent)) {
			return parent.id;
		}
		return this.id;
	}
	override allGrantedAuras(): SourcedAura[] {
		return [];
	}
	override allTriggeredEffects(): SourcedTriggeredEffect[] {
		return [];
	}
}
