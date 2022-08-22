import { BonusByType } from './types';

export function fromBonusesToFormula(bonuses: BonusByType): string | number {
	const sum = Object.keys(bonuses)
		.map((k) => bonuses[k])
		.reduce((a, b) => a + b, 0);

	return sum;
}

export type RollComponent = string | number;
export function combineRollComponents(lhs: RollComponent, rhs: RollComponent): RollComponent {
	// 0's and empty strings disappear
	if (!lhs && !rhs) return 0;
	if (!lhs) return rhs;
	if (!rhs) return lhs;
	if (typeof lhs === 'number') {
		if (typeof rhs === 'number') return lhs + rhs;
		// Constants always go last
		else return combineRollComponents(rhs, lhs);
	}
	if (typeof lhs === 'string') {
		if (typeof rhs === 'string') return `${lhs} + ${rhs}`;

		if (lhs && rhs > 0) {
			return `${lhs} + ${rhs}`;
		} else if (lhs && rhs < 0) {
			return `${lhs} - ${Math.abs(rhs)}`;
		} else {
			return lhs;
		}
	}
	return 0;
}
