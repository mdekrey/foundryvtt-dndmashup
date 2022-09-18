import { BaseDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { ActiveEffectDocumentConstructorParams } from '../../module/active-effect/types';
export * from './ApplyEffectDisplay';

export type ApplyEffectApplicationParameters = {
	effectParams: ActiveEffectDocumentConstructorParams;
	sources: BaseDocument[];
};

declare global {
	interface MashupApplication {
		applyEffect: ApplyEffectApplicationParameters;
	}
}
