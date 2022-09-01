import { Lens } from '@foundryvtt-dndmashup/core';
import { ActiveEffectTemplate } from './types';

const defaultActiveEffectTemplate: ActiveEffectTemplate = {
	duration: { durationType: 'endOfTurn', rounds: 1, useTargetActor: true },
	bonuses: [],
	afterEffect: null,
	afterFailedSave: null,
};
export const activeEffectTemplateDefaultLens = Lens.identity<ActiveEffectTemplate | null>().default(
	defaultActiveEffectTemplate,
	(value) =>
		value.bonuses.length === 0 &&
		value.afterEffect === null &&
		value.afterFailedSave === null &&
		value.duration.durationType === 'endOfTurn' &&
		value.duration.rounds === 1
);
