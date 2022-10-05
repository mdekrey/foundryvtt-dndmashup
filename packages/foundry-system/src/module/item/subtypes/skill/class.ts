import {
	FeatureBonusWithSource,
	DynamicListEntryWithSource,
	SourcedPoolBonus,
	SourcedPoolLimits,
	SourcedAura,
	SourcedTriggeredEffect,
} from '@foundryvtt-dndmashup/mashup-rules';
import { SkillDocument } from '@foundryvtt-dndmashup/mashup-react';
import { MashupItem } from '../../mashup-item';
import { PossibleItemType } from '../../types';

export class MashupSkill extends MashupItem<'skill'> implements SkillDocument {
	override canEmbedItem(type: PossibleItemType): boolean {
		return type === 'feature' || type === 'power';
	}
	override allGrantedBonuses(): FeatureBonusWithSource[] {
		return this.system.grantedBonuses.map((b) => ({ ...b, source: this }));
	}
	override allDynamicList(): DynamicListEntryWithSource[] {
		return this.system.dynamicList.map((b) => ({ ...b, source: this }));
	}
	override allGrantedPools(): SourcedPoolLimits[] {
		return [];
	}
	override allGrantedPoolBonuses(): SourcedPoolBonus[] {
		return [];
	}
	override allGrantedAuras(): SourcedAura[] {
		return [];
	}
	override allTriggeredEffects(): SourcedTriggeredEffect[] {
		return [];
	}
}
