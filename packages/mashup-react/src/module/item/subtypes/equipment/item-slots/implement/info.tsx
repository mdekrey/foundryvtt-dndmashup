import { TabbedSheet } from '@foundryvtt-dndmashup/components';
import { Lens } from '@foundryvtt-dndmashup/core';
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
	defaultEquipmentInfo,
	buildSummary: ({ equipmentProperties: input }) => <>{`${input.group}`}</>,
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
	additionalTabs: (stateful) => (
		<>
			<TabbedSheet.Tab name="attackEffects" label="Attack Effects">
				<AttackEffects {...additionalEffectsLens.apply(stateful)} />
			</TabbedSheet.Tab>
		</>
	),
	statsPreview: ({ equipmentProperties }) => <div>{/* TODO */}</div>,
};
