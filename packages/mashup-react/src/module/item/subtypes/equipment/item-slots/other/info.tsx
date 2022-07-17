import { ItemSlotInfo } from '../types';
import { ItemSlotDefaults } from './defaults';

export { ItemSlotDefaults };

export const OtherInfo: ItemSlotInfo<''> = {
	display: '',
	optionLabel: 'None',
	equippedSlots: [],
	...ItemSlotDefaults,
	slotsNeeded: () => 0,
};
