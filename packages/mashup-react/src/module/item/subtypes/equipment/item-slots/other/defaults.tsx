import { RulesText } from '@foundryvtt-dndmashup/components';
import { OtherItemSlotTemplate } from '../..';

export const itemSlotDefaults = (label: string) => ({
	display: label,
	optionLabel: label,
	defaultEquipmentInfo: { keywords: [] },
	details: () => <></>,
	bonuses: () => [],
	keywords: ({ keywords }: OtherItemSlotTemplate) => keywords ?? [],
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
