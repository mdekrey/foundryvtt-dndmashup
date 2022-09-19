import {
	ConditionRulesRuntimeParameters,
	DamageType,
	Defense,
	DynamicListTarget,
	FullFeatureBonus,
} from '@foundryvtt-dndmashup/mashup-rules';
import { ActorDocument } from '../../module/actor';
import { NumericBonusTarget } from '@foundryvtt-dndmashup/mashup-rules';
import { EquipmentDocument } from '../../module/item';

export * from './DiceRoller';
export * from './DamageRoller';

export type DiceRollApplicationParametersBase = {
	baseDice: string;
	title: string;
	actor: ActorDocument;
	rollType: NumericBonusTarget;
	allowToolSelection: boolean;
	flavor?: string;
	extraBonuses?: FullFeatureBonus[];
	runtimeBonusParameters: ConditionRulesRuntimeParameters;
};

export type DamageRollApplicationParametersBase = {
	baseDice: string;
	baseDamageTypes: DamageType[];
	title: string;
	actor: ActorDocument;
	rollType: NumericBonusTarget;
	listType: DynamicListTarget;
	allowToolSelection: boolean;
	extraBonuses?: FullFeatureBonus[];
	runtimeBonusParameters: ConditionRulesRuntimeParameters;
};

export type DiceRollApplicationParameters = DiceRollApplicationParametersBase & {
	sendToChat: boolean;
};

export type AttackRollApplicationParameters = DiceRollApplicationParametersBase & {
	rollType: 'attack-roll';
	defense: Defense;
};

export type DamageRollApplicationParameters = DamageRollApplicationParametersBase & {
	rollType: 'damage';
	allowCritical: boolean;
};

export type CriticalDamageRollApplicationParameters = DamageRollApplicationParametersBase & {
	rollType: 'critical-damage';
	tool?: EquipmentDocument<'weapon' | 'implement'>;
};

export type HealingRollApplicationParameters = DiceRollApplicationParametersBase & {
	rollType: 'healing';

	spendHealingSurge: boolean;
	healingSurge: boolean;
	isTemporary: boolean;
};

declare global {
	interface MashupApplication {
		attackRoll: AttackRollApplicationParameters;
		damage: DamageRollApplicationParameters;
		criticalDamage: CriticalDamageRollApplicationParameters;
		healing: HealingRollApplicationParameters;
		diceRoll: DiceRollApplicationParameters;
	}
	interface MashupApplicationResult {
		diceRoll: number;
	}
}
