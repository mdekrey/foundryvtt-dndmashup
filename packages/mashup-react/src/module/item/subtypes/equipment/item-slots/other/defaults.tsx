import { RulesText } from '@foundryvtt-dndmashup/components';

export const itemSlotDefaults = (label: string) => ({
	display: label,
	optionLabel: label,
	defaultEquipmentInfo: {},
	details: () => <></>,
	bonuses: () => [],
	buildSummary: () => <></>,
	inventoryTableHeader: () => <></>,
	inventoryTableBody: () => <></>,
	inventoryTableAddedCellCount: 0,
	slotsNeeded: () => 1,

	statsPreview: () => (
		<>
			<RulesText label="Item Slot">{label}</RulesText>
		</>
	),
});
