import { AnyDocument } from './types';

export function fromMashupId(id: string): AnyDocument {
	const steps = id.split(':');
	const result = steps.reduce((prev: any, next, index) => {
		const [collectionName, id] = next.split('.');
		if (typeof prev !== 'object' || prev === null) {
			throw new Error(`Unable to locate object at ${steps.slice(index).join(':')}`);
		}
		const collection = prev[collectionName];
		if (!(collection instanceof foundry.utils.Collection)) {
			throw new Error(
				`Unable to locate collection ${collectionName} in ${index === 0 ? 'game' : steps.slice(index).join(':')}`
			);
		}
		return collection.get(id);
	}, game as unknown);
	return result;
}
