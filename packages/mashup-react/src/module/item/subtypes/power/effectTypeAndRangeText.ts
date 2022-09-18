import { neverEver } from '@foundryvtt-dndmashup/core';
import { EffectTypeAndRange } from './dataSourceData';

export function effectTypeAndRangeText(typeAndRange: EffectTypeAndRange, excludeType = false) {
	const prefix = excludeType ? '' : `${typeAndRange.type} `;
	switch (typeAndRange.type) {
		case 'melee':
			return prefix + typeAndRange.range;
		case 'area':
			return `${prefix}${typeAndRange.shape} ${typeAndRange.size} within ${typeAndRange.within}`;
		case 'close':
			return `${prefix}${typeAndRange.shape} ${typeAndRange.size}`;
		case 'personal':
			return prefix;
		case 'ranged':
			return prefix + typeAndRange.range;
		case 'within':
			return prefix + typeAndRange.size;
		default:
			return neverEver(typeAndRange);
	}
}
