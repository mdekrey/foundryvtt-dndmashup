import { ActorDocument } from '@foundryvtt-dndmashup/mashup-react';
import { MashupDiceContext } from '../../dice/MashupDiceContext';

export async function roll(
	dice: string,
	context: MashupDiceContext,
	sendToChatAs?: ActorDocument
): Promise<Roll<MashupDiceContext>> {
	// Example full formula: 1d20 + 2[ability bonus] + 4[power bonus] + 2[bonus]
	const roll = Roll.create(dice, context);
	console.log(roll);
	await roll.evaluate();

	if (sendToChatAs) {
		await roll.toMessage({
			speaker: {
				actor: sendToChatAs.id,
				token: sendToChatAs.token?.id,
				alias: sendToChatAs.name,
			},
		});
	}
	return roll;
}
