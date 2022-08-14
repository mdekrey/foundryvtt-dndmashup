import { ClassData, ClassDocument } from './subtypes/class/dataSourceData';
import { RaceData, RaceDocument } from './subtypes/race/dataSourceData';
import { EquipmentData, EquipmentDocument } from './subtypes/equipment/dataSourceData';
import { FeatureData, FeatureDocument } from './subtypes/feature/dataSourceData';
import { ParagonPathData, ParagonPathDocument } from './subtypes/paragonPath/dataSourceData';
import { EpicDestinyData, EpicDestinyDocument } from './subtypes/epicDestiny/dataSourceData';
import { PowerData, PowerDocument } from './subtypes/power/dataSourceData';
import { ItemSlot } from './subtypes/equipment/item-slots';
import { SimpleDocument, TypedData } from '@foundryvtt-dndmashup/foundry-compat';
import { FeatureBonus } from '../../bonuses';
import { BaseItemTemplateDataSourceData } from './templates/bases';

export interface ItemDataByType {
	class: ClassData;
	race: RaceData;
	equipment: { [K in ItemSlot]: EquipmentData<K> }[ItemSlot];
	feature: FeatureData;
	paragonPath: ParagonPathData;
	epicDestiny: EpicDestinyData;
	power: PowerData;
}

export interface ItemDocumentByType {
	class: ClassDocument;
	race: RaceDocument;
	equipment: { [K in ItemSlot]: EquipmentDocument<K> }[ItemSlot];
	feature: FeatureDocument;
	paragonPath: ParagonPathDocument;
	epicDestiny: EpicDestinyDocument;
	power: PowerDocument;
}

export type PossibleItemType = keyof ItemDataByType;

export type PossibleItemSourceData = ItemDataByType[keyof ItemDataByType];
export type SpecificItemSourceData<T extends PossibleItemType> = ItemDataByType[T];

export type CommonItemDocumentProperties = {
	allGrantedBonuses(): FeatureBonus[];
	allGrantedPowers(): PowerDocument[];
};

export type ItemDocument<
	TData extends TypedData<string, BaseItemTemplateDataSourceData> = TypedData<string, BaseItemTemplateDataSourceData>
> = SimpleDocument<TData> & CommonItemDocumentProperties;
