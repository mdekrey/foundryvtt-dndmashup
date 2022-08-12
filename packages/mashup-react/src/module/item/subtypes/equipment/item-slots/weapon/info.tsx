import { TabbedSheet } from '@foundryvtt-dndmashup/components';
import { Lens } from '@foundryvtt-dndmashup/mashup-core';
import { AttackEffects } from '../../../../../../effects';
import { ItemSlotInfo } from '../types';
import { weaponGroups } from './config';
import { WeaponDetails } from './details';
import { WeaponItemSlotTemplate } from './types';
import { defaultEquipmentInfo } from './weaponEquipmentInfo';

const additionalEffectsLens = Lens.fromProp<WeaponItemSlotTemplate>()('additionalEffects').default({});

export const WeaponInfo: ItemSlotInfo<'weapon'> = {
	display: 'Weapon',
	optionLabel: 'Weapon',
	equippedSlots: ['primary-hand', 'off-hand'],
	slotsNeeded: (inputData) => inputData.hands,
	bonuses: () => [],
	defaultEquipmentInfo,
	buildSummary: ({ equipmentProperties: input }) => (
		<>
			{[
				`${input.hands}-handed ${input.category} ${input.group}, ${input.damage}, prof. +${input.proficiencyBonus}`,
				input.range,
				...input.properties,
			]
				.filter(Boolean)
				.join(', ')}
		</>
	),
	details: WeaponDetails,
	inventoryTableHeader: () => (
		<>
			<th>Group</th>
			<th>Damage</th>
			<th>Range</th>
		</>
	),
	inventoryTableBody: ({ equipmentProperties }) => (
		<>
			<td className="text-center">{weaponGroups[equipmentProperties.group]}</td>
			<td className="text-center">{equipmentProperties.damage}</td>
			<td className="text-center">{equipmentProperties.range || <>&mdash;</>}</td>
		</>
	),
	inventoryTableAddedCellCount: 3,
	additionalTabs: (stateful) => (
		<>
			<TabbedSheet.Tab name="attackEffects" label="Attack Effects">
				<AttackEffects {...additionalEffectsLens.apply(stateful)} />
			</TabbedSheet.Tab>
		</>
	),
};
