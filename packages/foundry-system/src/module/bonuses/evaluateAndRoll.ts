import { groupBy } from 'lodash/fp';
import { FeatureBonusWithContext } from 'dndmashup-react/src/module/bonuses';

const max = (v: number[]) => Math.max(...v);
const sum = (v: number[]) => v.reduce((prev, next: number) => prev + next, 0);

export function evaluateAndRoll(bonusesWithContext: FeatureBonusWithContext[]) {
	const applicableBonuses = bonusesWithContext.map(({ type, amount, context }) => ({
		type: type || '',
		amount: typeof amount === 'number' ? new Roll(`${amount}`) : new Roll(amount, context),
		original: amount,
		context,
	}));
	// TODO - allow non-deterministic formulas for damage, attack rolls, etc. - should not use Roll until then.
	const deterministicBonuses = applicableBonuses.filter(({ amount }) => amount.isDeterministic);
	const byType = groupBy((e) => e.type, deterministicBonuses);

	const finalBonuses = Object.fromEntries(
		Object.entries(byType).map(([k, v]) => {
			const mapped = v.map(({ amount }) => amount.roll({ async: false })._total);
			const formula = k === '' ? sum : max;
			const value = formula(mapped);
			return [k, value];
		})
	);

	return finalBonuses;
}
