import { applicationRegistry, DiceRoller } from '@foundryvtt-dndmashup/mashup-react';

applicationRegistry.diceRoll = ({ baseDice, title }, resolve) => {
	return [<DiceRoller baseDice={baseDice} onRoll={onRoll} />, `Roll: ${title}`];

	async function onRoll(dice: string) {
		// Example full formula: 1d20 + 2[ability bonus] + 4[power bonus] + 2[bonus]
		const roll = Roll.create(dice);
		console.log(roll.formula);
		await roll.evaluate();
		const json = roll.toJSON();
		console.log(roll, json);
		await roll.toMessage();
		if (roll.total !== undefined) resolve(roll.total);
	}
};
