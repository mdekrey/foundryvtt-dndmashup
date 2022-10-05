import { ClassSystemData, ClassDocument } from './subtypes/class/dataSourceData';
import { RaceSystemData, RaceDocument } from './subtypes/race/dataSourceData';
import { EquipmentSystemData, EquipmentDocument } from './subtypes/equipment/dataSourceData';
import { FeatureSystemData, FeatureDocument } from './subtypes/feature/dataSourceData';
import { ParagonPathSystemData, ParagonPathDocument } from './subtypes/paragonPath/dataSourceData';
import { EpicDestinySystemData, EpicDestinyDocument } from './subtypes/epicDestiny/dataSourceData';
import { PowerSystemData, PowerDocument } from './subtypes/power/dataSourceData';
import { ItemSlot } from './subtypes/equipment/item-slots';
import { SimpleDocument, TypedData } from '@foundryvtt-dndmashup/foundry-compat';
import { DynamicListEntry, FeatureBonus, SourcedAura } from '@foundryvtt-dndmashup/mashup-rules';
import { SkillSystemData, SkillDocument } from './subtypes/skill';
import { BaseItemTemplateDataSourceData } from './templates/bases';

export interface ItemDataByType {
	class: ClassSystemData;
	race: RaceSystemData;
	equipment: { [K in ItemSlot]: EquipmentSystemData<K> }[ItemSlot];
	feature: FeatureSystemData;
	paragonPath: ParagonPathSystemData;
	epicDestiny: EpicDestinySystemData;
	power: PowerSystemData;
	skill: SkillSystemData;
}

export interface ItemDocumentByType {
	class: ClassDocument;
	race: RaceDocument;
	equipment: { [K in ItemSlot]: EquipmentDocument<K> }[ItemSlot];
	feature: FeatureDocument;
	paragonPath: ParagonPathDocument;
	epicDestiny: EpicDestinyDocument;
	power: PowerDocument;
	skill: SkillDocument;
}

export type PossibleItemType = keyof ItemDataByType;

export type PossibleItemTypes = ItemDataByType[keyof ItemDataByType];

export type SpecificItemSystemData<T extends PossibleItemType> = ItemDataByType[T];
export type PossibleItemSystemData = SpecificItemSystemData<PossibleItemType>;

export type SpecificItemDataSource<T extends PossibleItemType> = { [K in T]: TypedData<K, ItemDataByType[K]> }[T];
export type PossibleItemDataSource = SpecificItemDataSource<PossibleItemType>;

export type CommonItemDocumentProperties = {
	allGrantedBonuses(): FeatureBonus[];
	allDynamicList(): DynamicListEntry[];
	allGrantedPowers(): PowerDocument[];
	allGrantedAuras(): SourcedAura[];
};

export type ItemDocument<
	TData extends TypedData<string, BaseItemTemplateDataSourceData> = PossibleItemDataSource
	// eslint-disable-next-line @typescript-eslint/ban-types
> = SimpleDocument<TData, {}> & CommonItemDocumentProperties;
