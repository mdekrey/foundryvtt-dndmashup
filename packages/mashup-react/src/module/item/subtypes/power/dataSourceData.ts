import { SimpleDocument, TypedData } from '@foundryvtt-dndmashup/foundry-compat';
import { DamageType, Defense } from '../../../../types/types';
import { CommonItemDocumentProperties } from '../../item-data-types-template';
import { BaseItemTemplateDataSourceData } from '../../templates/bases';

export type PowerDataSourceData = BaseItemTemplateDataSourceData & {
	type: string;
	flavorText: string;
	usage: PowerUsage;
	keywords: string[];
	actionType: ActionType;
	special: string;
	displayOverride: string;
	trigger?: string;
	prerequisite?: string;
	requirement?: string; // TODO: should this be a condition?
	isBasic: boolean;

	effects: PowerEffect[];
};

export type PowerData = TypedData<'power', PowerDataSourceData>;

export type PowerEffect = {
	name: string;
	target: string;
	typeAndRange: EffectTypeAndRange;
	attackRoll: AttackRoll | null;
	hit: ApplicableEffect;
	miss: ApplicableEffect | null;
};

export type ApplicableEffect = {
	text: string;
	healing: HealingEffect | null;
	damage: DamageEffect | null;
	// TODO: effect template to drag/drop to apply ongoing effects
};

export type PowerUsage = 'at-will' | 'encounter' | 'daily' | 'item' | 'other' | `recharge-${2 | 3 | 4 | 5 | 6}`;
export type ActionType = 'standard' | 'move' | 'minor' | 'free' | 'opportunity' | 'immediate';

export type EffectTypeAndRange =
	| MeleeEffectTypeAndRange
	| RangedEffectTypeAndRange
	| CloseEffectTypeAndRange
	| AreaEffectTypeAndRange
	| PersonalEffectTypeAndRange
	| PrimaryEffectTypeAndRange;
export type MeleeEffectTypeAndRange = { type: 'melee'; range: 'weapon' | 1 | 'touch' };
export type RangedEffectTypeAndRange = { type: 'ranged'; range: 'weapon' | number | 'sight' };
/** 'within' isn't a by-the-book type, as evidenced by things like Righteous Brand and Lance of Faith, but is really a close burst type effect that can have a range of sight. */
export type WithinEffectTypeAndRange = { type: 'within'; size: number | 'sight' };
export type CloseEffectTypeAndRange = { type: 'close'; shape: 'burst' | 'blast'; size: number };
export type AreaEffectTypeAndRange = { type: 'area'; shape: 'burst' | 'wall'; size: number; within: number };
export type PersonalEffectTypeAndRange = { type: 'personal' };
export type PrimaryEffectTypeAndRange = { type: 'same-as-primary' };

export type AttackRoll = {
	attack: string;
	defense: Defense;
};

export type DamageEffect = {
	damage: string;
	damageTypes: DamageType[];
};

export type HealingEffect = {
	healing: string;
	healingSurge: boolean;
	isTemporary: boolean;
};

export type PowerDocument = SimpleDocument<PowerData> & CommonItemDocumentProperties;
