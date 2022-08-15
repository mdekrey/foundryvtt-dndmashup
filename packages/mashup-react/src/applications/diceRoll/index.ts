import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { DamageType, Defense, DynamicListTarget } from '@foundryvtt-dndmashup/mashup-rules';
import { ActorDocument } from '../../module/actor';
import { NumericBonusTarget } from '@foundryvtt-dndmashup/mashup-rules';
import { EquipmentDocument, PowerDocument } from '../../module/item';

export * from './DiceRoller';
export * from './DamageRoller';

export type DiceRollApplicationParametersBase = {
	baseDice: string;
	title: string;
	actor: ActorDocument;
	source: SimpleDocument;
	power?: PowerDocument;
	rollType: NumericBonusTarget;
	allowToolSelection: boolean;
};

export type DamageRollApplicationParametersBase = {
	baseDice: string;
	baseDamageTypes: DamageType[];
	title: string;
	actor: ActorDocument;
	source: SimpleDocument;
	power?: PowerDocument;
	rollType: NumericBonusTarget;
	listType: DynamicListTarget;
	allowToolSelection: boolean;
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
