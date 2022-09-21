import { groupBy } from 'lodash/fp';
import { BonusByType, ConditionRuleContext, FeatureBonusWithContext } from '@foundryvtt-dndmashup/mashup-rules';
import { simplifyDice } from '../dice';
import { ensureSign } from '@foundryvtt-dndmashup/core';
import { emptyConditionContext } from '@foundryvtt-dndmashup/mashup-react';

const max = (v: number[]) => Math.max(...v);

export function evaluateBonusByType(
	bonusesWithContext: FeatureBonusWithContext[],
	initialBonuses?: BonusByType
): BonusByType {
	const extraBonuses = Object.entries(initialBonuses ?? {}).map(
		([type, value]): FeatureBonusWithContext => ({
			amount: value,
			target: '' as never,
			type,
			condition: null,
			context: { ...emptyConditionContext },
		})
	);
	const byType = groupBy((e) => e.type || '', [...bonusesWithContext, ...extraBonuses]);

	const finalBonuses = Object.fromEntries(
		Object.entries(byType)
			.map(([k, v]) => {
				if (k === '') {
					const determinateBonuses = v.map(({ amount, context }) =>
						typeof amount === 'number' ? amount : simplifyDice(amount, context)
					);
					const resultValue = determinateBonuses.some((bonus) => typeof bonus === 'string')
						? determinateBonuses.map((v) => ensureSign(v)).reduce((a, b) => a + b, '')
						: determinateBonuses.reduce((a, b) => Number(a) + Number(b), 0);

					return [[k, resultValue]];
				}

				const value = max(v.map(({ amount, context }) => evaluateAmount(amount, context)));
				return [[k, value]];
			})
			.flat()
	);

	return finalBonuses;
}

function evaluateAmount(amount: string | number, context: ConditionRuleContext) {
	return typeof amount === 'number' ? amount : new Roll(amount, context).roll({ async: false })._total;
}
