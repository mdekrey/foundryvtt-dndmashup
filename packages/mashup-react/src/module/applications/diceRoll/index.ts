import { Defense } from '../../../types/types';
import { ActorDocument } from '../../actor';
import { BonusTarget } from '../../bonuses';
import { PowerDocument } from '../../item';

export * from './DiceRoller';

export type DiceRollApplicationParametersBase = {
	baseDice: string;
	title: string;
	actor: ActorDocument;
	relatedPower?: PowerDocument;
	rollType: BonusTarget;
};

export type DiceRollApplicationParameters = DiceRollApplicationParametersBase & {
	sendToChat: boolean;
};

export type AttackRollApplicationParameters = DiceRollApplicationParametersBase & {
	rollType: 'attack-roll';
	defense: Defense;
	targets: ActorDocument[];
};

export type DamageRollApplicationParameters = DiceRollApplicationParametersBase & {
	rollType: 'damage';
	// TODO: is crit?
};

export type HealingRollApplicationParameters = DiceRollApplicationParametersBase & {
	rollType: 'healing';
};

declare global {
	interface MashupApplication {
		attackRoll: AttackRollApplicationParameters;
		damage: DamageRollApplicationParameters;
		healing: HealingRollApplicationParameters;
		diceRoll: DiceRollApplicationParameters;
	}
	interface MashupApplicationResult {
		diceRoll: number;
	}
}
