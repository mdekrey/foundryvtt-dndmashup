import { CommonAction } from './common-action';

export const spendActionPoint: CommonAction = {
	name: 'Spend Action Point',
	img: 'icons/skills/movement/arrow-upward-yellow.webp',
	action: 'free',
	usage: 'encounter',
	hint: 'Once per encounter, spend an action point to gain an extra turn',
	isReady: (actor) =>
		actor.system.actionPoints.value > 0 && (actor.type === 'monster' || !actor.system.actionPoints.usedThisEncounter),
	setReady: (actor, ready) => {
		actor.update({ 'data.actionPoints.usedThisEncounter': !ready }, {});
	},
	use: async (actor, { chatDispatch }) => {
		if (actor.type !== 'monster' && actor.system.actionPoints.usedThisEncounter) return;
		if (actor.system.actionPoints.value < 1) return;
		const otherEffects = await actor.spendActionPoint();
		if (otherEffects === null) return;
		chatDispatch.sendChatMessage(
			'plain-text',
			actor,
			`spends an action point to get another action! ${otherEffects.join(' ')}`
		);
	},
};
