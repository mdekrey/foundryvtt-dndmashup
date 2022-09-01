import { ActiveEffectDocumentConstructorParams } from '../../module/active-effect/types';
export * from './ApplyEffectDisplay';

export type ApplyEffectApplicationParameters = {
	effectParams: ActiveEffectDocumentConstructorParams;
};

declare global {
	interface MashupApplication {
		applyEffect: ApplyEffectApplicationParameters;
	}
}
