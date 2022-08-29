import { CommonAction } from './common-action';

export const longRest: CommonAction = {
	name: 'Long Rest',
	img: 'icons/environment/wilderness/camp-improvised.webp',
	action: 'none',
	usage: 'daily',
	hint: '',
	isReady: () => true,
	use: (actor, { appDispatch }) => {
		appDispatch.launchApplication('longRest', { actor });
	},
};
