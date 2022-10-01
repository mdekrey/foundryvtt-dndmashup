import { chatAttachments } from '../attach';
import { AttackRollResult, RollJson } from '@foundryvtt-dndmashup/foundry-compat';
import { BonusByType, Defense, sumFinalBonuses } from '@foundryvtt-dndmashup/mashup-rules';
import {
	chatMessageRegistry,
	AttackResult,
	PowerDocument,
	EquipmentDocument,
} from '@foundryvtt-dndmashup/mashup-react';
import { fromMashupId, isGame } from '../../../core/foundry';

type ResultEntry = {
	tokenId: string | null;
	tokenName: string | null;
	rollResult: AttackRollResult | null;
	roll: RollJson;
};

chatMessageRegistry.attackResult = async (actor, properties) => {
	const results = properties.results.map(
		({ target, bonuses, roll }): ResultEntry => ({
			tokenId: target?.id ?? null,
			tokenName: target?.name ?? null,
			roll: roll,
			rollResult: toResult(
				roll as never as ReturnType<Roll['toJSON']>,
				target?.id ?? null,
				bonuses,
				properties.defense
			),
		})
	);
	return {
		flags: { results, powerId: properties.powerId, toolId: properties.toolId },
		flavor: properties.flavor,
		sound: 'sounds/dice.wav',
	};
};
chatAttachments['attackResult'] = ({ flags: { results, powerId, toolId }, speaker: { actor: actorId } }) => {
	const myGame = game;
	if (!isGame(myGame)) {
		console.error('no game', myGame);
		throw new Error('Could not attach');
	}

	const actor = (actorId ? myGame.actors?.get(actorId) : null) ?? undefined;
	const power = powerId ? (fromMashupId(powerId as string) as never as PowerDocument) : undefined;
	const tool = toolId
		? (fromMashupId(toolId as string) as never as EquipmentDocument<'weapon' | 'implement'>)
		: undefined;

	const props = (results as ResultEntry[]).map((entry) => {
		const roll = Roll.fromJSON(JSON.stringify(entry.roll));
		return {
			tokenId: entry.tokenId,
			tokenName: entry.tokenName,
			rollResult: entry.rollResult,
			rollData: entry.roll,
			roll: roll,
		};
	});

	return (
		<AttackResult
			entries={props}
			lookupToken={(tokenId) => myGame.canvas?.tokens?.get(tokenId)?.document}
			actor={actor}
			power={power}
			tool={tool}
		/>
	);
};

function toResult(
	roll: ReturnType<Roll['toJSON']>,
	tokenId: string | null,
	bonuses: BonusByType | undefined,
	defense: Defense
): AttackRollResult | null {
	const token = (isGame(game) && tokenId ? game.canvas.tokens?.get(tokenId) : null) ?? null;

	const d20Term = roll.terms.find((t: any): t is DiceTerm => t.faces === 20 && t.number === 1);
	if (d20Term && d20Term.total === 1) return 'critical-miss';
	const defenseValue = bonuses
		? sumFinalBonuses(bonuses)
		: token?.actor?.derivedCache.bonuses.getValue(`defense-${defense}`);
	console.log(tokenId, defenseValue, bonuses);
	if (!defenseValue || roll.total === undefined) return null;
	if (d20Term && d20Term.number === 20 && roll.total >= defenseValue) return 'critical-hit';
	if (d20Term && d20Term.number === 20) return 'maybe-critical-hit';
	if (defenseValue > roll.total) return 'miss';
	return 'hit';
}
