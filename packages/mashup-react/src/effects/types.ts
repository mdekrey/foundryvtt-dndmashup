import { DamageType, FeatureBonus } from '@foundryvtt-dndmashup/mashup-rules';
import { TemplateEffectDurationInfo } from '../module/active-effect/types';

export type InstantaneousEffect = {
	text: string;
	healing: HealingEffect | null;
	damage: DamageEffect | null;
	// TODO: effect template to drag/drop to apply ongoing effects
	activeEffectTemplate: ActiveEffectTemplate | null;
};

export type DamageEffect = {
	damage: string;
	damageTypes: DamageType[];
};

export type HealingEffect = {
	healing: string;
	spendHealingSurge: boolean;
	healingSurge: boolean;
	isTemporary: boolean;
};

export type ActiveEffectTemplate = {
	label: string;
	image: string | null;
	duration: TemplateEffectDurationInfo;
	bonuses: FeatureBonus[];
	afterEffect: ActiveEffectTemplate | null;
	afterFailedSave: ActiveEffectTemplate | null;

	startOfTurn: InstantaneousEffect | null;
	endOfTurn: InstantaneousEffect | null;
};
