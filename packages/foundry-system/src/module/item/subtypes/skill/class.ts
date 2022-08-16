import { DynamicListEntry, FeatureBonus } from '@foundryvtt-dndmashup/mashup-rules';
import { SkillDocument } from '@foundryvtt-dndmashup/mashup-react';
import { MashupItem } from '../../mashup-item';
import { PossibleItemType } from '../../types';

export class MashupSkill extends MashupItem<'skill'> implements SkillDocument {
	override canEmbedItem(type: PossibleItemType): boolean {
		return type === 'feature' || type === 'power';
	}
	override allGrantedBonuses(): FeatureBonus[] {
		return this.data.data.grantedBonuses;
	}
	override allDynamicList(): DynamicListEntry[] {
		return this.data.data.dynamicList;
	}
}
