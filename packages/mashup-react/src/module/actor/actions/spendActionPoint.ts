import noop from 'lodash/fp/noop';
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
	use: noop,
};
