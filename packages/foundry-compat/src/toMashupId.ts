import { BaseDocument } from './interfaces/simple-document';

export function toMashupId(target: BaseDocument): string {
	const current = `${target.collectionName}.${target.id}`;
	if (target.parent) return `${toMashupId(target.parent)}:${current}`;
	return current;
}
