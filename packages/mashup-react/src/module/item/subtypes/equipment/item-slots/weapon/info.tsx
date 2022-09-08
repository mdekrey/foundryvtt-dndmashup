import { RulesText, TabbedSheet } from '@foundryvtt-dndmashup/components';
import { ensureSign, Lens, oxfordComma } from '@foundryvtt-dndmashup/core';
import { getEffectText } from '@foundryvtt-dndmashup/mashup-rules';
import { AttackEffects } from '../../../../../../effects';
import { ItemSlotInfo } from '../types';
import { weaponGroups, weaponCategories, weaponProperties, weaponHands } from './config';
import { WeaponDetails } from './details';
import { WeaponItemSlotTemplate } from './types';
import { defaultEquipmentInfo } from './weaponEquipmentInfo';

const additionalEffectsLens = Lens.fromProp<WeaponItemSlotTemplate>()('additionalEffects').default({});

export const WeaponInfo: ItemSlotInfo<'weapon'> = {
	display: 'Weapon',
	optionLabel: 'Weapon',
	equippedSlots: ['primary-hand', 'off-hand'],
	slotsNeeded: (inputData) => inputData.hands,
	bonuses: (inputData) => [
		{
			amount: inputData.proficiencyBonus,
			target: 'attack-roll',
			condition: { rule: 'proficientIn', parameter: null },
			type: 'proficiency',
		},
	],
	keywords: (inputData) => [
		'weapon',
		inputData.category,
		inputData.group,
		...inputData.properties,
		...(inputData.keywords ?? []),
	],
	defaultEquipmentInfo,
	buildSummary: ({ equipmentProperties: input }) => (
		<>
			{[
				`${input.hands}-handed ${weaponCategories[input.category]} ${weaponGroups[input.group]}`,
				`${input.damage}`,
				`prof. ${ensureSign(input.proficiencyBonus)}`,
				input.range,
				...input.properties.map((p) => weaponProperties[p]),
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
	additionalTabs: (stateful, item) => (
		<>
			<TabbedSheet.Tab name="attackEffects" label="Attack Effects">
				<AttackEffects {...additionalEffectsLens.apply(stateful)} fallbackImage={item.img} />
			</TabbedSheet.Tab>
		</>
	),
	statsPreview: ({ equipmentProperties }) => (
		<>
			<RulesText label={`Weapon`}>
				{weaponGroups[equipmentProperties.group]} ✦ {weaponCategories[equipmentProperties.category]}
			</RulesText>
			<RulesText label={weaponHands[equipmentProperties.hands]} />
			<RulesText label={`Base Damage`}>{equipmentProperties.damage}</RulesText>
			<RulesText label={`Proficiency`}>{ensureSign(equipmentProperties.proficiencyBonus)}</RulesText>
			<RulesText label={`Range`}>{equipmentProperties.range}</RulesText>
			<RulesText label={`Properties`}>
				{oxfordComma(equipmentProperties.properties.map((p) => weaponProperties[p]))}
			</RulesText>
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
