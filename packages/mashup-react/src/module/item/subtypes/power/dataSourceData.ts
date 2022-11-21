import { SimpleDocument, TypedData } from '@foundryvtt-dndmashup/foundry-compat';
import {
	Defense,
	PoolLimits,
	InstantaneousEffect,
	ActiveEffectTemplate,
	Trigger,
	FeatureBonus,
} from '@foundryvtt-dndmashup/mashup-rules';
import { CommonItemDocumentProperties } from '../../item-data-types-template';
import { BaseItemTemplateDataSourceData } from '../../templates/bases';

export type PowerDataSourceData = BaseItemTemplateDataSourceData & {
	type: string;
	flavorText: string;
	usage: PowerUsage;
	rechargeTrigger: Trigger | null;
	keywords: string[];
	actionType: ActionType;
	special: string;
	displayOverride: string;
	trigger?: string | null;
	prerequisite?: string | null;
	requirement?: string | null; // TODO: should this be a condition?
	isBasic: boolean;

	selfApplied: ActiveEffectTemplate | null;

	effects: PowerEffect[];

	usedPools?: string[];
	grantedPools?: PoolLimits[];
};

export type PowerSystemData = PowerDataSourceData;
export type PowerData = TypedData<'power', PowerSystemData>;

export type PowerEffect = {
	name: string;
	noteLabel: string;
	note: string;
	target: string;
	typeAndRange: EffectTypeAndRange;
	attackRoll: AttackRoll | null;
	hit: InstantaneousEffect;
	miss: InstantaneousEffect | null;
	bonuses: FeatureBonus[] | null;
};

export type PowerUsage =
	| 'at-will'
	| 'encounter'
	| 'daily'
	| 'item'
	| 'item-consumable'
	| 'item-healing-surge'
	| 'other';
export type ActionType =
	| 'standard'
	| 'move'
	| 'minor'
	| 'free'
	| 'opportunity'
	| 'immediate-interrupt'
	| 'immediate-reaction'
	| 'none';

export type EffectTypeAndRange =
	| MeleeEffectTypeAndRange
	| RangedEffectTypeAndRange
	| WithinEffectTypeAndRange
	| CloseEffectTypeAndRange
	| AreaEffectTypeAndRange
	| PersonalEffectTypeAndRange;
export type MeleeEffectTypeAndRange = { type: 'melee'; range: 'weapon' | 1 | 'touch' };
export type RangedEffectTypeAndRange = { type: 'ranged'; range: 'weapon' | number | 'sight' };
/** 'within' isn't a by-the-book type, as evidenced by things like Righteous Brand and Lance of Faith, but is really a close burst type effect that can have a range of sight. */
export type WithinEffectTypeAndRange = { type: 'within'; size: number | 'sight' | 'weapon' };
export type CloseEffectTypeAndRange = { type: 'close'; shape: 'burst' | 'blast'; size: number };
export type AreaEffectTypeAndRange = { type: 'area'; shape: 'burst' | 'wall'; size: number; within: number | 'weapon' };
export type PersonalEffectTypeAndRange = { type: 'personal' };

export type AttackRoll = {
	attack: string;
	defense: Defense;
};

export type PowerDocument = SimpleDocument<PowerData> &
	CommonItemDocumentProperties & {
		readonly powerGroupId: string | null;
	};
