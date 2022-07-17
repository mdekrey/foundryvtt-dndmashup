import { SimpleDocument, SimpleDocumentData } from '@foundryvtt-dndmashup/foundry-compat';
import { EquipmentData } from '../item/subtypes/equipment/dataSourceData';
import { EquippedItemSlot } from '../item/subtypes/equipment/item-slots';
import { PowerDocument } from '../item/subtypes/power/dataSourceData';
import { ActorDerivedData } from './derivedDataType';
import { PossibleActorType, ActorDataSource } from './types';

export type TokenDocument = {
	id: string | null;
};

export type ActorDocument<T extends PossibleActorType = PossibleActorType> = SimpleDocument<ActorDataSource<T>> & {
	readonly derivedData: ActorDerivedData<T>;
	readonly token: null | TokenDocument;

	allPowers(): PowerDocument[];
	equip(itemData: SimpleDocumentData<EquipmentData>, equipSlot: EquippedItemSlot): void;
};
