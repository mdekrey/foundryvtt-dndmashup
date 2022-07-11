import { OtherDetails } from './details';

export const ItemSlotDefaults = {
	defaultEquipmentInfo: {},
	details: OtherDetails,
	bonuses: () => [],
	buildSummary: () => <></>,
	inventoryTableHeader: () => <></>,
	inventoryTableBody: () => <></>,
	inventoryTableAddedCellCount: 0,
	slotsNeeded: () => 1,
};
