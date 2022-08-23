import { BaseDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { FeatureBonus } from '@foundryvtt-dndmashup/mashup-rules';
import { ActorDocument } from '../actor';

export type EffectDurationType = 'endOfTurn' | 'startOfTurn' | 'saveEnds' | 'shortRest' | 'longRest' | 'other';

interface EffectDurationTypeData {
	endOfTurn: { durationTurnInit: number };
	startOfTurn: { durationTurnInit: number };
	other: { description: string };
}

interface ComputableEffectDurationTypeData {
	endOfTurn: { rounds: number; actor?: ActorDocument };
	startOfTurn: { rounds: number; actor?: ActorDocument };
	other: EffectDurationTypeData['other'];
}

export type EffectDurationInfo<T extends EffectDurationType = EffectDurationType> = {
	[K in T]: { durationType: K } & (K extends keyof EffectDurationTypeData ? EffectDurationTypeData[K] : unknown);
}[T];

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
		effectDuration?: EffectDurationInfo;
	};
};

export type ActiveEffectDocumentConstructorData = {
	icon?: string;
	label: string;
	flags?: ActiveEffectFlags;
};

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
