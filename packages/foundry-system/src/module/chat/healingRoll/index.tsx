import { chatAttachments } from '../attach';
import { RollJson } from '@foundryvtt-dndmashup/foundry-compat';
import { chatMessageRegistry, HealingResult, PowerDocument } from '@foundryvtt-dndmashup/mashup-react';
import { fromMashupId, isGame } from '../../../core/foundry';

chatMessageRegistry.healingResult = async (
	actor,
	{ result, powerId, flavor, isTemporary, healingSurge, spendHealingSurge }
) => {
	return {
		flags: { roll: result, powerId, isTemporary, healingSurge, spendHealingSurge },
		flavor,
		sound: 'sounds/dice.wav',
	};
};
chatAttachments['healingResult'] = ({ flags: { roll, powerId, isTemporary, healingSurge, spendHealingSurge } }) => {
	const myGame = game;
	if (!isGame(myGame)) {
		console.error('no game', myGame);
		throw new Error('Could not attach');
	}

	const rollData = roll as RollJson;
	const power = powerId ? (fromMashupId(powerId as string) as never as PowerDocument) : undefined;

	return (
		<HealingResult
			roll={rollData}
			power={power}
			isTemporary={isTemporary as boolean}
			spendHealingSurge={spendHealingSurge as boolean}
			onApply={() => typeof rollData.total === 'number' && handleApplyHealing(rollData.total)}
		/>
	);

	async function handleApplyHealing(value: number) {
		if (value === 0 && !healingSurge) return;
		if (!isGame(game)) return;
		const tokens = game.canvas?.tokens?.controlled ?? [];

		if (tokens.length < 1) {
			ui.notifications?.warn(`No tokens selected to apply healing.`);
		}

		await Promise.all(
			tokens.map(async (token) => {
				if (!token.actor) return;
				token.actor.applyHealing({
					amount: value,
					isTemporary: isTemporary as boolean,
					addHealingSurgeValue: healingSurge as boolean,
					spendHealingSurge: spendHealingSurge as boolean,
				});
			})
		);
	}
};
