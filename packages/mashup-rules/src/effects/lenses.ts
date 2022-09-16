import { Lens } from '@foundryvtt-dndmashup/core';
import { ActiveEffectTemplate } from './types';

const defaultActiveEffectTemplate: ActiveEffectTemplate = {
	label: '',
	useStandard: false,
	coreStatusId: null,
	image: null,
	duration: { durationType: 'endOfTurn', useTargetActor: true },
	bonuses: [],
	afterEffect: null,
	afterFailedSave: null,
	triggeredEffects: [],
	auras: [],
};
export const activeEffectTemplateDefaultLens = Lens.identity<ActiveEffectTemplate | null>().default(
	defaultActiveEffectTemplate,
	(value) => {
		const result =
			!value.label &&
			!value.useStandard &&
			!value.coreStatusId &&
			!value.image &&
			value.bonuses.length === 0 &&
			value.auras.length === 0 &&
			value.afterEffect === null &&
			value.afterFailedSave === null &&
			value.duration.durationType === 'endOfTurn' &&
			value.duration.useTargetActor &&
			!value.triggeredEffects?.length;
		return result;
	}
);
