import { FeatureBonus } from '../bonuses/types';
import { ConditionRule } from '../conditions/types';
import { Trigger } from '../triggers/types';
import { DamageType } from '../types';
import { TemplateEffectDurationInfo } from './duration-types';

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

export type TriggeredEffect = {
	effect: InstantaneousEffect;
	trigger: Trigger;
	condition: ConditionRule;
};

export type ActiveEffectTemplate = {
	label: string;
	image: string | null;
	duration: TemplateEffectDurationInfo;
	bonuses: FeatureBonus[];
	afterEffect: ActiveEffectTemplate | null;
	afterFailedSave: ActiveEffectTemplate | null;

	triggeredEffects: TriggeredEffect[];
};
