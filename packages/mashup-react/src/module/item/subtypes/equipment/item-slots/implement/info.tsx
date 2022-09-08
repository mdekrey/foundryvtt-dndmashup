import { RulesText, TabbedSheet } from '@foundryvtt-dndmashup/components';
import { Lens } from '@foundryvtt-dndmashup/core';
import { getEffectText } from '@foundryvtt-dndmashup/mashup-rules';
import { AttackEffects } from '../../../../../../effects';
import { ItemSlotInfo } from '../types';
import { ImplementItemSlotTemplate } from './types';
import { defaultEquipmentInfo } from './defaultEquipmentInfo';
import { ImplementDetails } from './details';
import { implementGroups } from './config';

const additionalEffectsLens = Lens.fromProp<ImplementItemSlotTemplate>()('additionalEffects').default({});

export const ImplementInfo: ItemSlotInfo<'implement'> = {
	display: 'Implement',
	optionLabel: 'Implement',
	equippedSlots: ['primary-hand', 'off-hand'],
	slotsNeeded: () => 1,
	bonuses: () => [],
	keywords: (inputData) => ['implement', inputData.group, ...(inputData.keywords ?? [])],
	defaultEquipmentInfo,
	buildSummary: ({ equipmentProperties: input }) => <>{`${implementGroups[input.group]}`}</>,
	details: ImplementDetails,
	inventoryTableHeader: () => (
		<>
			<th>Group</th>
		</>
	),
	inventoryTableBody: ({ equipmentProperties }) => (
		<>
			<td className="text-center">{implementGroups[equipmentProperties.group]}</td>
		</>
	),
	additionalTabs: (stateful, item) => (
		<>
			<TabbedSheet.Tab name="attackEffects" label="Attack Effects">
				<AttackEffects fallbackImage={item.img} {...additionalEffectsLens.apply(stateful)} />
			</TabbedSheet.Tab>
		</>
	),
	statsPreview: ({ equipmentProperties }) => (
		<>
			<RulesText label={`Implement ${implementGroups[equipmentProperties.group]}`} />
			{equipmentProperties.additionalEffects?.hit && (
				<RulesText label={`Hit`}>{getEffectText(equipmentProperties.additionalEffects.hit, { bonus: true })}</RulesText>
			)}
			{equipmentProperties.additionalEffects?.['critical-hit'] && (
				<RulesText label={`Critical Hit`}>
					{getEffectText(equipmentProperties.additionalEffects['critical-hit'], { bonus: true })}
				</RulesText>
			)}
		</>
	),
};
