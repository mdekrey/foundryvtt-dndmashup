import { CommonAction } from './common-action';
import { totalDefenseDuration, totalDefenseEffect } from './totalDefense';

export const secondWind: CommonAction = {
	name: 'Second Wind',
	img: 'icons/magic/defensive/shield-barrier-glowing-blue.webp',
	action: 'standard',
	usage: 'encounter',
	hint: 'Once per encounter, spend a healing surge and defend yourself',
	isReady: (actor) => !actor.system.health.secondWindUsed && actor.system.health.surgesRemaining.value > 0,
	setReady: (actor, ready) => {
		actor.update({ 'data.health.secondWindUsed': !ready }, {});
	},
	use: async (actor, { chatDispatch }) => {
		if (actor.system.health.secondWindUsed) return;
		await actor.applyHealing({
			addHealingSurgeValue: true,
			spendHealingSurge: true,
			additionalUpdates: { 'data.health.secondWindUsed': true },
		});
		await actor.createActiveEffect(totalDefenseEffect, totalDefenseDuration, false, [actor]);
		chatDispatch.sendChatMessage(
			'plain-text',
			actor,
			'... takes a moment to catch their breath, and gets a second wind!'
		);
	},
};
