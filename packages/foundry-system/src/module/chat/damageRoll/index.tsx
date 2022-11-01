import { chatAttachments } from '../attach';
import { RollJson } from '@foundryvtt-dndmashup/foundry-compat';
import { DamageType } from '@foundryvtt-dndmashup/mashup-rules';
import { chatMessageRegistry, DamageResult, PowerDocument } from '@foundryvtt-dndmashup/mashup-react';
import { fromMashupId, isGame } from '../../../core/foundry';
import { MashupActor } from '../../actor';
import { sendPlainChatMesage } from '../sendChatMessage';

chatMessageRegistry.damageResult = async (actor, { result, powerId, damageTypes, flavor }) => {
	return { flags: { roll: result, powerId, damageTypes }, flavor, sound: 'sounds/dice.wav' };
};
chatAttachments['damageResult'] = ({ flags: { roll, powerId, damageTypes } }) => {
	const myGame = game;
	if (!isGame(myGame)) {
		console.error('no game', myGame);
		throw new Error('Could not attach');
	}

	const rollData = roll as RollJson;
	const power = powerId ? (fromMashupId(powerId as string) as never as PowerDocument) : undefined;

	return (
		<DamageResult
			roll={rollData}
			damageTypes={(damageTypes as DamageType[]) ?? []}
			power={power}
			onApplyDamage={() => rollData.total && handleApplyDamage(rollData.total)}
			onApplyHalfDamage={() => rollData.total && handleApplyDamage(Math.floor(rollData.total / 2))}
		/>
	);

	async function handleApplyDamage(value: number) {
		if (value === 0) return;
		if (!isGame(game)) return;
		const tokens = game.canvas?.tokens?.controlled ?? [];

		await Promise.all(
			tokens.map(async (token) => {
				if (!token.actor) return;
				await applyDamage(token.actor, value, damageTypes as never);
			})
		);
	}
};

async function applyDamage(actor: MashupActor, amount: number, damageTypes: DamageType[]) {
	if (amount === 0) return;
	const health = actor.system.health;

	const allResistance =
		actor.derivedCache.bonuses.getValue('all-resistance') - actor.derivedCache.bonuses.getValue('all-vulnerability');
	const minResistance = Math.min(
		0,
		...damageTypes.map(
			(damageType) =>
				actor.derivedCache.bonuses.getValue(`${damageType}-resistance`) -
				actor.derivedCache.bonuses.getValue(`${damageType}-vulnerability`)
		)
	);
	const resistance = allResistance + minResistance;

	const effectiveAmount = Math.max(0, amount - resistance);
	if (effectiveAmount === 0) return;

	const tempHpRemaining = Math.max(0, health.temporaryHp - effectiveAmount);
	const damageRemaining = effectiveAmount - (health.temporaryHp - tempHpRemaining);
	const healthRemaining = health.hp.value - damageRemaining;
	const data: Partial<Record<'data.health.hp.value' | 'data.health.temporaryHp', number>> = {};
	if (tempHpRemaining !== health.temporaryHp) data['data.health.temporaryHp'] = tempHpRemaining;
	if (healthRemaining !== health.hp.value) data['data.health.hp.value'] = healthRemaining;
	await sendPlainChatMesage(actor, `${actor.displayName} took ${effectiveAmount} damage.`);
	actor.update(data);
}
