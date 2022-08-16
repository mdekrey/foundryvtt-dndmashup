import { chatAttachments } from '../attach';
import { RollJson } from '@foundryvtt-dndmashup/foundry-compat';
import { chatMessageRegistry, HealingResult, PowerDocument } from '@foundryvtt-dndmashup/mashup-react';
import { fromMashupId, isGame } from '../../../core/foundry';
import { MashupActor } from '../../actor/mashup-actor';

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
			onApply={() => rollData.total && handleApplyHealing(rollData.total)}
		/>
	);

	async function handleApplyHealing(value: number) {
		if (value === 0) return;
		if (!isGame(game)) return;
		const tokens = game.canvas?.tokens?.controlled ?? [];

		if (tokens.length < 1) {
			ui.notifications?.warn(`No tokens selected to apply healing.`);
		}

		await Promise.all(
			tokens.map(async (token) => {
				if (!token.actor) return;
				applyHealing(token.actor, value, isTemporary as boolean, healingSurge as boolean, spendHealingSurge as boolean);
			})
		);
	}
};

function applyHealing(
	actor: MashupActor,
	amount: number,
	isTemporary: boolean,
	healingSurge: boolean,
	spendHealingSurge: boolean
) {
	if (amount === 0) {
		ui.notifications?.warn(`Healing amount was 0.`);
		return;
	}
	const health = actor.data.data.health;

	if (spendHealingSurge && health.surgesRemaining.value <= 0) {
		ui.notifications?.warn(`Not enough healing surges available on ${actor.name}.`);
		return;
	}

	const effectiveAmount = amount + (healingSurge ? health.surgesValue : 0);

	const data: Partial<
		Record<'data.health.hp.value' | 'data.health.temporaryHp' | 'data.health.surgesRemaining.value', number>
	> = {};
	if (spendHealingSurge) {
		data['data.health.surgesRemaining.value'] = health.surgesRemaining.value - 1;
	}
	if (isTemporary) {
		data['data.health.temporaryHp'] = health.temporaryHp + effectiveAmount;
	} else {
		data['data.health.hp.value'] = Math.min(health.hp.max, health.hp.value + effectiveAmount);
	}
	actor.update(data);
}
