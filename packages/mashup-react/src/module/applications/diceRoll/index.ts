import { ActorDocument } from '../../actor';
import { BonusTarget } from '../../bonuses';
import { PowerDocument } from '../../item';

export * from './DiceRoller';

export type DiceRollApplicationParameters = {
	baseDice: string;
	title: string;
	actor: ActorDocument;
	relatedPower?: PowerDocument;
	rollType: BonusTarget;
};

declare global {
	interface MashupApplication {
		diceRoll: DiceRollApplicationParameters;
	}
	interface MashupApplicationResult {
		diceRoll: number;
	}
}
