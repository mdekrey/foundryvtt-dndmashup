import { ItemSlotInfo } from '../types';
import { itemSlotDefaults } from './defaults';

export { itemSlotDefaults };

export const OtherInfo: ItemSlotInfo<''> = {
	equippedSlots: [],
	...itemSlotDefaults('None'),
	display: '',
	keywords: ({ keywords }) => [...(keywords ?? [])],
	slotsNeeded: () => 0,
};
