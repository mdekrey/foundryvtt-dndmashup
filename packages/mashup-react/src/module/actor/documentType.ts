import { SimpleDocument, SimpleDocumentData } from '@foundryvtt-dndmashup/foundry-compat';
import { FeatureBonusWithContext } from '../bonuses';
import { EquipmentData } from '../item/subtypes/equipment/dataSourceData';
import { EquippedItemSlot } from '../item/subtypes/equipment/item-slots';
import { PowerDocument } from '../item/subtypes/power/dataSourceData';
import { ActorDerivedData } from './derivedDataType';
import { PossibleActorType, ActorDataSource } from './types';

export type TokenDocument = {
	id: string | null;
	name: string | null;
};

export type ActorDocument<T extends PossibleActorType = PossibleActorType> = SimpleDocument<ActorDataSource<T>> & {
	readonly derivedData: ActorDerivedData<T>;
	readonly token: null | TokenDocument;

	get allBonuses(): FeatureBonusWithContext[];
	get appliedBonuses(): FeatureBonusWithContext[];
	get indeterminateBonuses(): FeatureBonusWithContext[];

	allPowers(): PowerDocument[];
	equip(itemData: SimpleDocumentData<EquipmentData>, equipSlot: EquippedItemSlot): void;
};
