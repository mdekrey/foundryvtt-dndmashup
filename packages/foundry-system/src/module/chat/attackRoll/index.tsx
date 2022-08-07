import { chatAttachments } from '../attach';
import { chatMessageRegistry, RollJson, Defense } from '@foundryvtt-dndmashup/mashup-react';
import { isGame } from 'packages/foundry-system/src/core/foundry';

type RollResult = 'hit' | 'miss' | 'critical-miss' | 'critical-hit';

type ResultEntry = {
	tokenId: string | null;
	tokenName: string | null;
	rollResult: RollResult | null;
	roll: RollJson;
};

chatMessageRegistry.attackResult = async (actor, properties) => {
	const results = properties.results.map(
		({ target, roll }): ResultEntry => ({
			tokenId: target.id,
			tokenName: target.name,
			roll: roll,
			rollResult: toResult(roll as ReturnType<Roll['toJSON']>, target.id, properties.defense),
		})
	);
	return { flags: { results } };
};
chatAttachments['attackResult'] = ({ flags: { results } }) => {
	const myGame = game;
	if (!isGame(myGame)) {
		console.error('no game', myGame);
		throw new Error('Could not attach');
	}

	const props = (results as ResultEntry[]).map((entry) => ({
		tokenId: entry.tokenId,
		tokenName: entry.tokenName,
		rollResult: entry.rollResult,
		rollData: entry.roll,
		roll: Roll.fromJSON(JSON.stringify(entry.roll)),
	}));

	console.log('TODO: attaching attackResult chat', props);

	return <>Simple little content</>;
};

function toResult(roll: ReturnType<Roll['toJSON']>, tokenId: string | null, defense: Defense): RollResult | null {
	const token = (isGame(game) && tokenId ? game.canvas.tokens?.get(tokenId) : null) ?? null;

	const d20Term = roll.terms.find((t: any): t is DiceTerm => t.faces === 20);
	if (d20Term && d20Term.number === 1) return 'critical-miss';
	if (d20Term && d20Term.number === 20) return 'critical-hit';
	const defenseValue = token?.actor?.derivedData.defenses[defense];
	if (!defenseValue || roll.total === undefined) return null;
	if (defenseValue > roll.total) return 'miss';
	return 'hit';
}
