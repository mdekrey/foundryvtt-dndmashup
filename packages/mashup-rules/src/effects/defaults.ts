import { InstantaneousEffect } from './types';

export const emptyInstantaneousEffect: InstantaneousEffect = {
	text: '',
	healing: null,
	damage: null,
	activeEffectTemplate: null,
	bonuses: null,
};
export function isEmptyInstantaneousEffect(effect: InstantaneousEffect) {
	return (
		!effect.bonuses?.length &&
		effect.damage === null &&
		effect.healing === null &&
		effect.text === '' &&
		effect.activeEffectTemplate === null
	);
}
