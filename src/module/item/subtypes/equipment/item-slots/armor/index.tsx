import { ItemSlotInfo } from '../types';
import { ArmorDetails } from './details';

export const ArmorInfo: ItemSlotInfo<'armor'> = {
	display: 'Armor',
	optionLabel: 'Armor',
	bonuses: () => [],
	defaultEquipmentInfo: { armorBonus: 0, type: 'light', category: 'cloth', checkPenalty: 0, speedPenalty: 0 },
	buildSummary: ({ equipmentProperties: input }) => (
		<>{`${input.type} ${input.category}, armor bonus +${input.armorBonus}, check penalty ${input.checkPenalty}, speed penalty ${input.speedPenalty}`}</>
	),
	details: ArmorDetails,
};
