import { FeatureBonus } from '../bonuses/types';
import { ConditionRuleContext, SimpleConditionRule } from '../conditions/types';
import { Source } from '../sources';
import { Trigger } from '../triggers/types';
import { DamageType } from '../types';
import { TemplateEffectDurationInfo } from './duration-types';

export type InstantaneousEffect = {
	text: string;
	healing: HealingEffect | null;
	damage: DamageEffect | null;
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
	condition: SimpleConditionRule;
};

export type SourcedTriggeredEffect = TriggeredEffect & {
	sources: Source[];
};

export type FullTriggeredEffect = SourcedTriggeredEffect & {
	context: Partial<ConditionRuleContext>;
};

export type ActiveEffectTemplate = {
	label: string;
	coreStatusId: string | null;
	image: string | null;
	duration: TemplateEffectDurationInfo;
	bonuses: FeatureBonus[];
	afterEffect: ActiveEffectTemplate | null;
	afterFailedSave: ActiveEffectTemplate | null;

	triggeredEffects: TriggeredEffect[];
};
