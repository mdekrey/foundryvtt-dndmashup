export type EffectDurationType = 'endOfTurn' | 'startOfTurn' | 'saveEnds' | 'shortRest' | 'longRest' | 'other';

export interface EffectDurationTypeData {
	endOfTurn: { durationTurnInit: number };
	startOfTurn: { durationTurnInit: number };
	other: { description: string };
}

export type EffectDurationInfo<T extends EffectDurationType = EffectDurationType> = {
	[K in T]: { durationType: K } & (K extends keyof EffectDurationTypeData ? EffectDurationTypeData[K] : unknown);
}[T];

export interface TemplateEffectDurationTypeData {
	endOfTurn: { useTargetActor: boolean };
	startOfTurn: { useTargetActor: boolean };
	other: EffectDurationTypeData['other'];
}

export type TemplateEffectDurationInfo<T extends EffectDurationType = EffectDurationType> = {
	[K in T]: { durationType: K } & (K extends keyof TemplateEffectDurationTypeData
		? TemplateEffectDurationTypeData[K]
		: unknown);
}[T];
