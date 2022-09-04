import { Lens } from '@foundryvtt-dndmashup/core';
import { ActiveEffectTemplate } from './types';

const defaultActiveEffectTemplate: ActiveEffectTemplate = {
	label: '',
	image: null,
	duration: { durationType: 'endOfTurn', useTargetActor: true },
	bonuses: [],
	afterEffect: null,
	afterFailedSave: null,
	triggeredEffects: [],
};
export const activeEffectTemplateDefaultLens = Lens.identity<ActiveEffectTemplate | null>().default(
	defaultActiveEffectTemplate,
	(value) =>
		value.bonuses.length === 0 &&
		value.afterEffect === null &&
		value.afterFailedSave === null &&
		value.duration.durationType === 'endOfTurn' &&
		!!value.triggeredEffects?.length
);
