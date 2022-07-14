import { SimpleDocument } from 'src/core/interfaces/simple-document';
import { DamageType, Defense, TypedData } from 'src/types/types';
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
	trigger?: string;
	prerequisite?: string;
	requirement?: string; // TODO: should this be a condition?
	isBasic: boolean;
};

export type PowerData = TypedData<'power', PowerDataSourceData>;

export type PowerUsage = 'at-will' | 'encounter' | 'daily' | 'item' | 'other' | `recharge-${2 | 3 | 4 | 5 | 6}`;
export type ActionType = 'standard' | 'move' | 'minor' | 'free' | 'opportunity' | 'immediate';
export type PowerEffect = {
	/* TODO - multiple EffectTypeAndRange? */
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
	attack: string;
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
	damageTypes: DamageType[];
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

export type ApplicableEffect =
	| AttackEffect
	| DamageEffect
	| HalfDamageEffect
	| HealingEffect
	| TextEffect
	| TargetEffect;

export type PowerDocument = SimpleDocument<PowerData>;
