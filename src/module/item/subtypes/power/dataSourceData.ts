import { NoStringPath } from 'src/core/path-typings';
import { Ability, DamageType, Defense, TypedData } from 'src/types/types';
import { BaseItemTemplateDataSourceData } from '../../templates/bases';

export type PowerDataSourceData = BaseItemTemplateDataSourceData & {
	type: string;
	flavorText: string;
	usage: PowerUsage;
	keywords: string[];
	actionType: ActionType;
	effect: PowerEffect;
	special: string;
	displayOverride: string;
	prerequisite?: string;
	requirement?: string; // TODO: should this be a condition?
};

export type PowerData = TypedData<'power', PowerDataSourceData>;

export type PowerUsage = 'at-will' | 'encounter' | 'daily' | 'item' | 'other';
export type ActionType = 'standard' | 'move' | 'minor' | 'free' | 'opportunity' | 'immediate';
export type PowerEffect = {
	typeAndRange: EffectTypeAndRange;
	target: string;
	effects: ApplicableEffect[];
};

export type EffectTypeAndRange =
	| MeleeEffectTypeAndRange
	| RangedEffectTypeAndRange
	| CloseEffectTypeAndRange
	| AreaEffectTypeAndRange
	| PersonalEffectTypeAndRange
	| PrimaryEffectTypeAndRange;
export type MeleeEffectTypeAndRange = { type: 'melee'; range: 'weapon' | 1 | 'touch' };
export type RangedEffectTypeAndRange = { type: 'ranged'; range: 'weapon' | number | 'sight' };
export type CloseEffectTypeAndRange = { type: 'close'; shape: 'burst' | 'blast'; size: number };
export type AreaEffectTypeAndRange = { type: 'area'; shape: 'burst' | 'wall'; size: number; within: number };
export type PersonalEffectTypeAndRange = { type: 'personal' };
export type PrimaryEffectTypeAndRange = { type: 'same-as-primary' };

export type AttackRoll = {
	attackAbility: Ability;
	attackModifier: number;
	defense: Defense;
};

export type AttackEffect = {
	type: 'attack';
	attackRoll: AttackRoll;
	hit: ApplicableEffect[];
	miss: ApplicableEffect[];
};

export type TextEffect = {
	type: 'text';
	text: string;
};

export type DamageEffect = {
	type: 'damage';
	damage: string;
	damageType: DamageType;
};

export type HalfDamageEffect = {
	type: 'half-damage';
};

export type HealingEffect = {
	type: 'healing';
	healing: string;
	healingSurge: boolean;
};

export type TargetEffect = {
	type: 'target';
} & PowerEffect;

export type ApplicableEffect = NoStringPath &
	(AttackEffect | DamageEffect | HalfDamageEffect | HealingEffect | TextEffect | TargetEffect);
