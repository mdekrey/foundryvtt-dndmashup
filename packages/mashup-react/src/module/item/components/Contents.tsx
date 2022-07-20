import { ItemTable } from '@foundryvtt-dndmashup/foundry-compat';
import { EquipmentDocument } from '../subtypes/equipment/dataSourceData';
import { isEquipment } from '../subtypes/equipment/isEquipment';

export function Contents({ item }: { item: EquipmentDocument }) {
	return <ItemTable items={item.items.contents.filter<EquipmentDocument>(isEquipment)} title={'Item'} />;
}
