import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { SkillDocument } from './dataSourceData';

export function isSkill(item: SimpleDocument): item is SkillDocument {
	return item.type === 'skill';
}
