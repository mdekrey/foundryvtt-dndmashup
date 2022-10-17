import { BaseDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { AnyDocument } from './types';

declare function fromUuidSync(uuid: string): AnyDocument | null;

// TODO - with use of target.uuid, we could obsolete this functionality
export function toMashupId(target: BaseDocument): string {
	const result = innerToMashupId(target);
	// Debugging assistance
	try {
		if (fromUuidSync(target.uuid) !== target && !(target instanceof Actor)) {
			console.error(target, 'uuid did not identify itself');
		} else {
			return target.uuid;
		}
	} catch (ex) {
		console.error('error going to/from uuid for', target);
	}
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
