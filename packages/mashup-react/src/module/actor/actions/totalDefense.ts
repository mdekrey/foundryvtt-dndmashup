import noop from 'lodash/fp/noop';
import { CommonAction } from './common-action';

export const totalDefense: CommonAction = {
	name: 'Total Defense',
	img: 'icons/magic/defensive/shield-barrier-blue.webp',
	action: 'standard',
	usage: 'at-will',
	hint: '+2 to all Defenses until your next turn',
	isReady: () => true,
	use: noop,
};
