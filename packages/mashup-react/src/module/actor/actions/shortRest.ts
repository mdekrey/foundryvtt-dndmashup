import { noop } from 'lodash/fp';
import { CommonAction } from './common-action';

export const shortRest: CommonAction = {
	name: 'Short Rest',
	img: 'icons/sundries/survival/bedroll-grey.webp',
	action: 'none',
	usage: 'encounter',
	hint: '',
	isReady: () => true,
	use: noop,
};
