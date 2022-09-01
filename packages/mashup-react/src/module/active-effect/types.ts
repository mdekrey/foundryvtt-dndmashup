import { BaseDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { FeatureBonus } from '@foundryvtt-dndmashup/mashup-rules';
import type { ActorDocument } from '../actor';

export type EffectDurationType = 'endOfTurn' | 'startOfTurn' | 'saveEnds' | 'shortRest' | 'longRest' | 'other';

interface EffectDurationTypeData {
	endOfTurn: { durationTurnInit: number };
	startOfTurn: { durationTurnInit: number };
	other: { description: string };
}

export type EffectDurationInfo<T extends EffectDurationType = EffectDurationType> = {
	[K in T]: { durationType: K } & (K extends keyof EffectDurationTypeData ? EffectDurationTypeData[K] : unknown);
}[T];

interface ComputableEffectDurationTypeData {
	endOfTurn: { actor?: ActorDocument };
	startOfTurn: { actor?: ActorDocument };
	other: EffectDurationTypeData['other'];
}

export type ComputableEffectDurationInfo<T extends EffectDurationType = EffectDurationType> = {
	[K in T]: { durationType: K } & (K extends keyof ComputableEffectDurationTypeData
		? ComputableEffectDurationTypeData[K]
		: unknown);
}[T];

interface TemplateEffectDurationTypeData {
	endOfTurn: { useTargetActor: boolean };
	startOfTurn: { useTargetActor: boolean };
	other: EffectDurationTypeData['other'];
}

export type TemplateEffectDurationInfo<T extends EffectDurationType = EffectDurationType> = {
	[K in T]: { durationType: K } & (K extends keyof TemplateEffectDurationTypeData
		? TemplateEffectDurationTypeData[K]
		: unknown);
}[T];

export type ActiveEffectFlags = {
	core?: {
		statusId?: string;
	};
	mashup?: {
		bonuses?: FeatureBonus[];
		afterEffect?: ActiveEffectDocumentConstructorParams;
		afterFailedSave?: ActiveEffectDocumentConstructorParams;
		effectDuration?: EffectDurationInfo;
		// TODO: beginning of round ApplicableEffect
		// TODO: end of round ApplicableEffect
	};
};

export type ActiveEffectDocumentConstructorData = {
	icon?: string;
	label: string;
	flags?: ActiveEffectFlags;
};

export type ActiveEffectDocumentConstructorParams = [
	effect: ActiveEffectDocumentConstructorData,
	duration: ComputableEffectDurationInfo
];

export type ActiveEffectDocument = BaseDocument & {
	data: {
		flags: ActiveEffectFlags;
		duration: {
			rounds: number | undefined;
		};
	};
	img: string | null;
	showEditDialog(): void;
};
