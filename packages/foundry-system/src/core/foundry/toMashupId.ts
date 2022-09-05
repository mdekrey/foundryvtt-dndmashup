import { BaseDocument } from '@foundryvtt-dndmashup/foundry-compat';

export function toMashupId(target: BaseDocument): string {
	const result = innerToMashupId(target);
	return result;
}

function innerToMashupId(target: BaseDocument): string {
	const current = `${target.collectionName}.${target.id}`;
	if (target.parent) {
		const parentMashupId = innerToMashupId(target.parent);

		if ((target.parent as any)[target.collectionName] instanceof foundry.utils.Collection) {
			return `${parentMashupId}:${current}`;
		}
		// not a standard embedded document
		else if (target.parent instanceof Token && target instanceof Actor && (target.parent as any).actor === target) {
			return `${parentMashupId}:actor`;
		}
	}
	return current;
}
