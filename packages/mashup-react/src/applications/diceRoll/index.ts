import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { DamageType, Defense } from '../../types/types';
import { ActorDocument } from '../../module/actor';
import { NumericBonusTarget } from '../../bonuses';
import { EquipmentDocument, PowerDocument } from '../../module/item';

export * from './DiceRoller';

export type DiceRollApplicationParametersBase = {
	baseDice: string;
	title: string;
	actor: ActorDocument;
	source: SimpleDocument;
	power?: PowerDocument;
	rollType: NumericBonusTarget;
	allowToolSelection: boolean;
};

export type DiceRollApplicationParameters = DiceRollApplicationParametersBase & {
	sendToChat: boolean;
};

export type AttackRollApplicationParameters = DiceRollApplicationParametersBase & {
	rollType: 'attack-roll';
	defense: Defense;
};

export type DamageRollApplicationParameters = DiceRollApplicationParametersBase & {
	rollType: 'damage';
	damageTypes: DamageType[];
	allowCritical: boolean;
};

export type CriticalDamageRollApplicationParameters = DiceRollApplicationParametersBase & {
	rollType: 'critical-damage';
	damageTypes: DamageType[];
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
