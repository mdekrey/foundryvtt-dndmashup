import { RulesText } from '@foundryvtt-dndmashup/components';
import { ensureSign } from '@foundryvtt-dndmashup/core';
import { ItemSlotInfo } from '../types';
import { defaultEquipmentInfo } from './armorEquipmentInfo';
import { allArmorCategories, allArmorTypes } from './config';
import { ArmorDetails } from './details';

export const ArmorInfo: ItemSlotInfo<'armor'> = {
	display: 'Armor',
	optionLabel: 'Armor',
	bonuses: ({ armorBonus, speedPenalty, checkPenalty }) => [
		{ type: 'armor', target: 'defense-ac', amount: armorBonus, condition: null },
		{ type: 'armor', target: 'speed', amount: speedPenalty, condition: null },
		{
			type: 'armor',
			target: 'check',
			amount: checkPenalty,
			condition: { rule: 'manual', parameter: { conditionText: 'armor check penalty applies' } },
		},
	],
	equippedSlots: ['body'],
	slotsNeeded: () => 1,
	defaultEquipmentInfo,
	buildSummary: ({ equipmentProperties: input }) => (
		<>
			{[
				`${allArmorTypes[input.type]} ${allArmorCategories[input.category]}`,
				`armor bonus ${ensureSign(input.armorBonus)}`,
				`check ${input.checkPenalty < 0 ? 'penalty' : 'bonus'} ${ensureSign(input.checkPenalty, true)}`,
				`speed  ${input.speedPenalty < 0 ? 'penalty' : 'bonus'} ${ensureSign(input.speedPenalty, true)}`,
			].join(', ')}
		</>
	),
	details: ArmorDetails,
	inventoryTableHeader: () => (
		<>
			<th>Category</th>
			<th>Armor Bonus</th>
			<th>Check</th>
			<th>Speed</th>
		</>
	),
	inventoryTableBody: ({ equipmentProperties }) => (
		<>
			<td className="text-center">{allArmorCategories[equipmentProperties.category]}</td>
			<td className="text-center">{equipmentProperties.armorBonus}</td>
			<td className="text-center">{equipmentProperties.checkPenalty}</td>
			<td className="text-center">{equipmentProperties.speedPenalty}</td>
		</>
	),
	statsPreview: ({ equipmentProperties }) => (
		<div>
			<RulesText label="Armor">
				{allArmorCategories[equipmentProperties.category]} ✦ {allArmorTypes[equipmentProperties.type]}
			</RulesText>
			<RulesText label="Armor Bonus">{ensureSign(equipmentProperties.armorBonus)}</RulesText>
			<div className="grid grid-cols-2">
				<RulesText label="Check">{ensureSign(equipmentProperties.checkPenalty, true)}</RulesText>
				<RulesText label="Speed">{ensureSign(equipmentProperties.speedPenalty, true)}</RulesText>
			</div>
		</div>
	),
};
