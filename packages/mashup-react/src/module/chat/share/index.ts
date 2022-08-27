import { EquipmentDocument } from '../../item/subtypes/equipment/dataSourceData';
import { PowerDocument } from '../../item/subtypes/power/dataSourceData';

export type ShareChatMessage = {
	item: PowerDocument | EquipmentDocument;
};

declare global {
	interface MashupChatMessage {
		share: ShareChatMessage;
	}
}
