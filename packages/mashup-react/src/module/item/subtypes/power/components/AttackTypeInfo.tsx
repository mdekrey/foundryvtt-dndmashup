import { neverEver } from '@foundryvtt-dndmashup/core';
import { EffectTypeAndRange } from '../dataSourceData';
import { AttackTypeIcon } from './AttackTypeIcon';

function attackType(type: EffectTypeAndRange['type']) {
	switch (type) {
		case 'melee':
			return 'Melee';
		case 'ranged':
			return 'Ranged';
		case 'close':
			return 'Close';
		case 'area':
			return 'Area';
		case 'personal':
			return 'Personal';
		case 'within':
			return 'Within';
		default:
			return neverEver(type);
	}
}

export function AttackTypeInfo({ typeAndRange, isBasic }: { typeAndRange: EffectTypeAndRange; isBasic: boolean }) {
	return (
		<>
			<AttackTypeIcon attackType={typeAndRange.type} isBasic={isBasic} className="h-4 align-top inline-block" />{' '}
			<span className="font-bold">{attackType(typeAndRange.type)}</span> {rangeInfo()}
		</>
	);

	function rangeInfo() {
		switch (typeAndRange.type) {
			case 'melee':
				return typeAndRange.range;
			case 'area':
				return `${typeAndRange.shape} ${typeAndRange.size} within ${typeAndRange.within}`;
			case 'close':
				return `${typeAndRange.shape} ${typeAndRange.size}`;
			case 'personal':
				return '';
			case 'ranged':
				return typeAndRange.range;
			case 'within':
				return typeAndRange.size;
			default:
				return neverEver(typeAndRange);
		}
	}
}
