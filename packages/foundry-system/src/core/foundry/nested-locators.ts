import { MashupActor } from '../../module/actor';
import { AnyDocument } from './types';

declare function fromUuidSync(uuid: string): AnyDocument | null;

// TODO: consider making this async
export function fromMashupId(originalId: string): AnyDocument | undefined {
	const steps = originalId.split(':');
	const result = steps.reduce((prev: any, next, index) => {
		if (!prev) return undefined;
		if (next.includes('.')) {
			const [collectionName, id] = next.split('.');
			if (typeof prev !== 'object' || prev === null) {
				throw new Error(`Unable to locate object at ${steps.slice(index).join(':')}`);
			}
			const collection = prev[collectionName];
			if (!(collection instanceof foundry.utils.Collection) && !(collection instanceof Map)) {
				throw new Error(
					`Unable to locate collection ${collectionName} for ${
						index === 0 ? 'game' : steps.slice(index).join(':')
					} while resolving ${originalId}`
				);
			}
			return collection.get(id);
		} else {
			return prev[next];
		}
	}, game as unknown);
	return result ?? fromUuidSync(originalId) ?? undefined;
}

export function getActorFromUuid(uuid: string): MashupActor | undefined {
	const result = fromMashupId(uuid);
	if (result instanceof TokenDocument) return result.actor ?? undefined;
	if (result instanceof MashupActor) return result ?? undefined;
	return undefined;
}
