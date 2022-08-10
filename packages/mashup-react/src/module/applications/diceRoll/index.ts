import { DamageType, Defense } from '../../../types/types';
import { ActorDocument } from '../../actor';
import { BonusTarget } from '../../bonuses';
import { EquipmentDocument, PowerDocument } from '../../item';

export * from './DiceRoller';

export type DiceRollApplicationParametersBase = {
	baseDice: string;
	title: string;
	actor: ActorDocument;
	relatedPower: PowerDocument;
	rollType: BonusTarget;
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
