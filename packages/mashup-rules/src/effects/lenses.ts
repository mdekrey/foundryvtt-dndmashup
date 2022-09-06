import { Lens } from '@foundryvtt-dndmashup/core';
import { ActiveEffectTemplate } from './types';

const defaultActiveEffectTemplate: ActiveEffectTemplate = {
	label: '',
	coreStatusId: null,
	image: null,
	duration: { durationType: 'endOfTurn', useTargetActor: true },
	bonuses: [],
	afterEffect: null,
	afterFailedSave: null,
	triggeredEffects: [],
};
export const activeEffectTemplateDefaultLens = Lens.identity<ActiveEffectTemplate | null>().default(
	defaultActiveEffectTemplate,
	(value) => {
		const result =
			!value.label &&
			!value.coreStatusId &&
			!value.image &&
			value.bonuses.length === 0 &&
			value.afterEffect === null &&
			value.afterFailedSave === null &&
			value.duration.durationType === 'endOfTurn' &&
			value.duration.useTargetActor &&
			!value.triggeredEffects?.length;
		console.log(result, value);
		return result;
	}
);
