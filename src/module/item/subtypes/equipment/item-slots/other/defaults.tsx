import { OtherDetails } from './details';

export const ItemSlotDefaults = {
	defaultEquipmentInfo: {},
	details: OtherDetails,
	bonuses: () => [],
	buildSummary: () => <></>,
	inventoryTableHeader: () => <></>,
	inventoryTableBody: () => <></>,
	slotsNeeded: () => 1,
};
