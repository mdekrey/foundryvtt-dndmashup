import { BaseDocument } from '@foundryvtt-dndmashup/foundry-compat';
import {
	Aura,
	EffectDurationInfo,
	EffectDurationType,
	EffectDurationTypeData,
	FeatureBonus,
	TriggeredEffect,
} from '@foundryvtt-dndmashup/mashup-rules';
import type { ActorDocument } from '../actor';

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

export type ActiveEffectFlags = {
	core?: {
		statusId?: string;
	};
	mashup?: {
		bonuses?: FeatureBonus[];
		triggers?: TriggeredEffect[];
		auras?: Aura[];
		afterEffect?: ActiveEffectDocumentConstructorParams;
		afterFailedSave?: ActiveEffectDocumentConstructorParams;
		effectDuration?: EffectDurationInfo;
	};
};

export type ActiveEffectDocumentConstructorData = {
	icon?: string;
	label: string;
	flags?: ActiveEffectFlags;
};

export type ActiveEffectDocumentConstructorParams = [
	effect: ActiveEffectDocumentConstructorData,
	duration: ComputableEffectDurationInfo,
	useStandardStats: boolean
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
