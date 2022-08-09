import { chatAttachments } from '../attach';
import { RollJson } from '@foundryvtt-dndmashup/foundry-compat';
import {
	chatMessageRegistry,
	Defense,
	AttackResult,
	AttackRollResult,
	PowerDocument,
} from '@foundryvtt-dndmashup/mashup-react';
import { fromMashupId, isGame } from '../../../core/foundry';

type ResultEntry = {
	tokenId: string | null;
	tokenName: string | null;
	rollResult: AttackRollResult | null;
	roll: RollJson;
};

chatMessageRegistry.attackResult = async (actor, properties) => {
	console.log('rolling', properties.results);
	const results = properties.results.map(
		({ target, roll }): ResultEntry => ({
			tokenId: target.id,
			tokenName: target.name,
			roll: roll,
			rollResult: toResult(roll as never as ReturnType<Roll['toJSON']>, target.id, properties.defense),
		})
	);
	return { flags: { results, powerId: properties.powerId }, flavor: properties.flavor, sound: 'sounds/dice.wav' };
};
chatAttachments['attackResult'] = ({ flags: { results, powerId } }) => {
	const myGame = game;
	if (!isGame(myGame)) {
		console.error('no game', myGame);
		throw new Error('Could not attach');
	}

	const power = powerId ? (fromMashupId(powerId as string) as never as PowerDocument) : undefined;

	const props = (results as ResultEntry[]).map((entry) => ({
		tokenId: entry.tokenId,
		tokenName: entry.tokenName,
		rollResult: entry.rollResult,
		rollData: entry.roll,
		roll: Roll.fromJSON(JSON.stringify(entry.roll)),
		content: Roll.fromJSON(JSON.stringify(entry.roll)).getTooltip(),
	}));

	return <AttackResult entries={props} lookupToken={(tokenId) => myGame.canvas?.tokens?.get(tokenId)} power={power} />;
};

function toResult(roll: ReturnType<Roll['toJSON']>, tokenId: string | null, defense: Defense): AttackRollResult | null {
	const token = (isGame(game) && tokenId ? game.canvas.tokens?.get(tokenId) : null) ?? null;

	const d20Term = roll.terms.find((t: any): t is DiceTerm => t.faces === 20 && t.number === 1);
	if (d20Term && d20Term.total === 1) return 'critical-miss';
	const defenseValue = token?.actor?.derivedData.defenses[defense];
	if (!defenseValue || roll.total === undefined) return null;
	if (d20Term && d20Term.number === 20 && roll.total >= defenseValue) return 'critical-hit';
	if (d20Term && d20Term.number === 20) return 'maybe-critical-hit';
	if (defenseValue > roll.total) return 'miss';
	return 'hit';
}
