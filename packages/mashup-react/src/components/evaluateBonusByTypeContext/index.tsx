import { BonusByType, FeatureBonusWithContext } from '@foundryvtt-dndmashup/mashup-rules';
import { createContext, useContext } from 'react';

export type EvaluateBonusByTypeContext = (bonusesWithContext: FeatureBonusWithContext[]) => BonusByType;

const evaluateBonusByTypeContext = createContext<null | EvaluateBonusByTypeContext>(null);

export const EvaluateBonusByTypeProvider = evaluateBonusByTypeContext.Provider;
export function useEvaluateBonusByType(): EvaluateBonusByTypeContext {
	const result = useContext(evaluateBonusByTypeContext);
	if (result === null) throw new Error('evaluateBonusByType not provided');
	return result;
}
