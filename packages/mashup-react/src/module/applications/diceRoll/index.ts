import { ActorDocument } from '../../actor';
import { PowerDocument } from '../../item';

export * from './DiceRoller';

export type DiceRollApplicationParameters = {
	baseDice: string;
	title: string;
	actor: ActorDocument;
	relatedPower?: PowerDocument;
};

declare global {
	interface MashupApplication {
		diceRoll: DiceRollApplicationParameters;
	}
	interface MashupApplicationResult {
		diceRoll: number;
	}
}
