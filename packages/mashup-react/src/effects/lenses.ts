import { Lens } from '@foundryvtt-dndmashup/core';
import { ActiveEffectTemplate } from './types';

const defaultActiveEffectTemplate: ActiveEffectTemplate = {
	label: '',
	image: null,
	duration: { durationType: 'endOfTurn', rounds: 1, useTargetActor: true },
	bonuses: [],
	afterEffect: null,
	afterFailedSave: null,
	startOfTurn: null,
	endOfTurn: null,
};
export const activeEffectTemplateDefaultLens = Lens.identity<ActiveEffectTemplate | null>().default(
	defaultActiveEffectTemplate,
	(value) =>
		value.bonuses.length === 0 &&
		value.afterEffect === null &&
		value.afterFailedSave === null &&
		value.duration.durationType === 'endOfTurn' &&
		value.duration.rounds === 1 &&
		value.startOfTurn === null &&
		value.endOfTurn === null
);
