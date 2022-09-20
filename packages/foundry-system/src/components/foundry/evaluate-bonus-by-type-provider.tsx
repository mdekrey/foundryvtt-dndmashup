import { EvaluateBonusByTypeContext, EvaluateBonusByTypeProvider } from '@foundryvtt-dndmashup/mashup-react';
import { evaluateBonusByType } from '../../module/bonuses/evaluateAndRoll';

const evaluateBonusByTypeContextValue: EvaluateBonusByTypeContext = evaluateBonusByType;

export function WrapEvaluateBonusByType({ children }: { children?: React.ReactNode }) {
	return <EvaluateBonusByTypeProvider value={evaluateBonusByTypeContextValue}>{children}</EvaluateBonusByTypeProvider>;
}
