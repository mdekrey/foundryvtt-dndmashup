import { CommonAction } from './common-action';

export const secondWind: CommonAction = {
	name: 'Second Wind',
	img: 'icons/magic/defensive/shield-barrier-glowing-blue.webp',
	action: 'standard',
	usage: 'encounter',
	hint: 'Once per encounter, spend a healing surge and defend yourself',
	isReady: (actor) => !actor.data.data.health.secondWindUsed && actor.data.data.health.surgesRemaining.value > 0,
	setReady: (actor, ready) => {
		actor.update({ 'data.health.secondWindUsed': !ready }, {});
	},
	use: (actor, chatDispatch) => {
		if (actor.data.data.health.secondWindUsed) return;
		actor.applyHealing({
			addHealingSurgeValue: true,
			spendHealingSurge: true,
			additionalUpdates: { 'data.health.secondWindUsed': true },
		});
		// TODO - add total defense
		chatDispatch.sendChatMessage(
			'plain-text',
			actor,
			'... takes a moment to catch their breath, and gets a second wind!'
		);
	},
};
