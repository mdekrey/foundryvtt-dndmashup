import { ItemSlotInfo } from '../types';
import { ShieldDetails } from './details';

export const ShieldInfo: ItemSlotInfo<'shield'> = {
	display: 'Shield',
	optionLabel: 'Shield',
	equippedSlots: ['off-hand'],
	bonuses: () => [],
	defaultEquipmentInfo: { type: 'light', shieldBonus: 1, checkPenalty: 0 },
	buildSummary: (input) => `${input.type}, shield bonus +${input.shieldBonus}, check penalty ${input.checkPenalty}`,
	details: ShieldDetails,
};
