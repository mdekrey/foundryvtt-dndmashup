import { groupBy } from 'lodash/fp';
import { BonusByType, FeatureBonusWithContext, untypedBonus } from '@foundryvtt-dndmashup/mashup-react';

const max = (v: number[]) => Math.max(...v);

export function evaluateAndRoll(bonusesWithContext: FeatureBonusWithContext[]): BonusByType {
	const byType = groupBy((e) => e.type, bonusesWithContext);

	console.log(bonusesWithContext);
	const finalBonuses = Object.fromEntries(
		Object.entries(byType)
			.map(([k, v]) => {
				if (k === '') {
					const byType = groupBy((e) => typeof e.amount, v);
					const indeterminateBonuses = (byType['string'] ?? [])
						.map(({ amount }) => amount as string)
						.map((amount) => amount.trim().replace(/^\+/, ''))
						.join(' + ');
					const determinateBonuses = (byType['number'] ?? [])
						.map(({ amount }) => amount as number)
						.reduce((a, b) => a + b, 0);

					return [
						['', determinateBonuses],
						[untypedBonus, indeterminateBonuses],
					];
				}
				// console.log([k, v]);
				const value = max(
					v.map(({ amount, context }) =>
						typeof amount === 'number' ? amount : new Roll(amount, context).roll({ async: false })._total
					)
				);
				return [[k, value]];
			})
			.flat()
	);

	return finalBonuses;
}
