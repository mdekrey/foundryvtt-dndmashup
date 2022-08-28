import { CommonAction } from './common-action';

export const spendActionPoint: CommonAction = {
	name: 'Spend Action Point',
	img: 'icons/skills/movement/arrow-upward-yellow.webp',
	action: 'free',
	usage: 'encounter',
	hint: 'Once per encounter, spend an action point to gain an extra turn',
	isReady: (actor) => !actor.data.data.actionPoints.usedThisEncounter,
	setReady: (actor, ready) => {
		actor.update({ 'data.actionPoints.usedThisEncounter': !ready }, {});
	},
	use: async (actor, { chatDispatch }) => {
		if (actor.data.data.actionPoints.usedThisEncounter) return;
		if (actor.data.data.actionPoints.value < 1) return;
		await actor.update(
			{
				'data.actionPoints.usedThisEncounter': true,
				'data.actionPoints.value': actor.data.data.actionPoints.value - 1,
			},
			{}
		);
		// TODO: action point additional effects
		chatDispatch.sendChatMessage('plain-text', actor, 'spends an action point to get another action!');
	},
};
