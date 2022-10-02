import { BaseDocument } from '@foundryvtt-dndmashup/foundry-compat';

export function toMashupId(target: BaseDocument): string {
	const result = innerToMashupId(target);
	return result;
}

function innerToMashupId(target: BaseDocument): string {
	const current = `${target.collectionName}.${target.id}`;
	if (target.parent) {
		const parentMashupId = innerToMashupId(target.parent);

		const collection = (target.parent as any)[target.collectionName];
		if (collection instanceof foundry.utils.Collection || collection instanceof Map) {
			return `${parentMashupId}:${current}`;
		}
		// not a standard embedded document
		else if (
			target.parent instanceof TokenDocument &&
			target instanceof Actor &&
			(target.parent as any).actor === target
		) {
			return `${parentMashupId}:actor`;
		}
	}
	return current;
}

(window as any).toMashupId = toMashupId;
