import { FeatureBonus } from '../bonuses';

export type ItemSlot = 'weapon' | 'shield' | 'armor' | 'arms' | 'feet' | 'hands' | 'head' | 'neck' | 'ring' | 'waist';

export type ItemSlotTemplates = {
	weapon: {
		damage: string;
		proficiencyBonus: number;
		range: string;
		group: string;
		properties: string[];
		category: string;
		hands: string;
	};
};

export type ItemSlotInfo<T extends ItemSlot> = {
	label: string;
	equippedSlots?: string[];
} & (T extends keyof ItemSlotTemplates
	? {
			bonuses: (inputData: ItemSlotTemplates[T]) => FeatureBonus[];
	  }
	: object);

export const itemSlots: {
	[K in ItemSlot]: ItemSlotInfo<K>;
} = {
	weapon: { label: 'Weapon', equippedSlots: ['Primary', 'Off-Hand'], bonuses: () => [] },
	shield: { label: 'Weapon', equippedSlots: ['Off-Hand'] },
	armor: { label: 'Armor' },
	arms: { label: 'Arms' },
	feet: { label: 'Feet' },
	hands: { label: 'Hands' },
	head: { label: 'Head' },
	neck: { label: 'Neck' },
	ring: { label: 'Ring', equippedSlots: ['Left', 'Right'] },
	waist: { label: 'Waist' },
};
