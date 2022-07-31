export * from './DiceRoller';

export type DiceRollApplicationParameters = {
	baseDice: string;
	title: string;
};

declare global {
	interface MashupApplication {
		diceRoll: DiceRollApplicationParameters;
	}
	interface MashupApplicationResult {
		diceRoll: number;
	}
}
