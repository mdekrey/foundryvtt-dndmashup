import { TypedData } from 'src/types/types';
import { ItemSlot } from './subtypes/equipment/item-slots';
import {
	ItemDataBaseProperties,
	ItemDataConstructorData,
	ItemDataSchema,
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData';
import { PropertiesToSource } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import { BaseItem } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs';
import { ClassData } from './subtypes/class/dataSourceData';
import { RaceData } from './subtypes/race/dataSourceData';
import { EquipmentData } from './subtypes/equipment/dataSourceData';
import { FeatureData } from './subtypes/feature/dataSourceData';
import { ParagonPathData } from './subtypes/paragonPath/dataSourceData';
import { EpicDestinyData } from './subtypes/epicDestiny/dataSourceData';
import { PowerData } from './subtypes/power/dataSourceData';

export type PossibleItemSourceData =
	| ClassData
	| RaceData
	| EquipmentData
	| FeatureData
	| ParagonPathData
	| EpicDestinyData
	| PowerData;

type ItemData<TData, TSource extends TypedData<string, unknown>> = foundry.abstract.DocumentData<
	ItemDataSchema,
	ItemDataBaseProperties & TData,
	PropertiesToSource<ItemDataBaseProperties> & TSource,
	ItemDataConstructorData,
	BaseItem
> &
	ItemDataBaseProperties &
	TData;

declare global {
	interface SourceConfig {
		Item: PossibleItemSourceData;
	}
	interface DataConfig {
		Item: PossibleItemSourceData;
	}
}

export type PossibleItemData =
	| ItemData<ClassData, ClassData>
	| ItemData<RaceData, RaceData>
	| ItemData<EquipmentData, EquipmentData>
	| ItemData<FeatureData, FeatureData>
	| ItemData<ParagonPathData, ParagonPathData>
	| ItemData<EpicDestinyData, EpicDestinyData>
	| ItemData<PowerData, PowerData>;

export type PossibleItemType = PossibleItemData['type'];

export type SpecificItemData<T extends PossibleItemType> = PossibleItemData & { type: T };
export type SpecificItemEquipmentData<TItemSlot extends ItemSlot = ItemSlot> = SpecificItemData<'equipment'> &
	ItemData<EquipmentData<TItemSlot>, EquipmentData<TItemSlot>>;
