import { ClassData } from './subtypes/class/dataSourceData';
import { RaceData } from './subtypes/race/dataSourceData';
import { EquipmentData } from './subtypes/equipment/dataSourceData';
import { FeatureData } from './subtypes/feature/dataSourceData';
import { ParagonPathData } from './subtypes/paragonPath/dataSourceData';
import { EpicDestinyData } from './subtypes/epicDestiny/dataSourceData';
import { PowerData } from './subtypes/power/dataSourceData';
import { ItemSlot } from './subtypes/equipment/item-slots';

export interface ItemDataByType {
	class: ClassData;
	race: RaceData;
	equipment: { [K in ItemSlot]: EquipmentData<K> }[ItemSlot];
	feature: FeatureData;
	paragonPath: ParagonPathData;
	epicDestiny: EpicDestinyData;
	power: PowerData;
}

export type PossibleItemType = keyof ItemDataByType;

export type PossibleItemSourceData = ItemDataByType[keyof ItemDataByType];
export type SpecificItemSourceData<T extends PossibleItemType> = ItemDataByType[T];
