import { SimpleDocument, SimpleDocumentData } from '@foundryvtt-dndmashup/foundry-compat';
import { BonusByType, DynamicListEntryWithContext, FeatureBonusWithContext } from '@foundryvtt-dndmashup/mashup-rules';
import { ComputableEffectDurationInfo } from '../active-effect/types';
import { ActiveEffectDocumentConstructorData } from '../active-effect/types';
import { PossibleItemType } from '../item';
import { EquipmentData } from '../item/subtypes/equipment/dataSourceData';
import { EquippedItemSlot } from '../item/subtypes/equipment/item-slots';
import { PowerDocument } from '../item/subtypes/power/dataSourceData';
import { ActorDerivedData } from './derivedDataType';
import { PossibleActorType, ActorDataSource } from './types';

export type TokenDocument = {
	id: string | null;
	name: string | null;

	readonly isOwner: boolean;
	control?(options?: { releaseOthers?: boolean }): boolean;
};

export type HealingOptions = {
	amount?: number;
	isTemporary?: boolean;
	addHealingSurgeValue?: boolean;
	spendHealingSurge?: boolean;
	additionalUpdates?: Record<string, unknown>;
};

export type ActorDocument<T extends PossibleActorType = PossibleActorType> = SimpleDocument<ActorDataSource<T>> & {
	readonly derivedData: ActorDerivedData<T>;
	readonly token: null | TokenDocument;

	get allBonuses(): FeatureBonusWithContext[];
	get appliedBonuses(): FeatureBonusWithContext[];
	get indeterminateBonuses(): FeatureBonusWithContext[];

	get allDynamicListResult(): DynamicListEntryWithContext[];
	get appliedDynamicList(): DynamicListEntryWithContext[];
	get indeterminateDynamicList(): DynamicListEntryWithContext[];

	allPowers(includeNestedPowers?: boolean): PowerDocument[];
	equip(itemData: SimpleDocumentData<EquipmentData>, equipSlot: EquippedItemSlot): void;
	isReady(power: PowerDocument): boolean;
	toggleReady(power: PowerDocument): Promise<boolean>;
	applyUsage(power: PowerDocument): Promise<boolean>;

	applyHealing(options: HealingOptions): Promise<void>;

	createActiveEffect(
		effect: ActiveEffectDocumentConstructorData,
		duration: ComputableEffectDurationInfo
	): Promise<void>;

	applyShortRest(healingSurges: number, healingBonusByType: BonusByType): Promise<boolean>;
	applyLongRest(): Promise<boolean>;

	importChildItem(type?: PossibleItemType): Promise<void>;

	evaluateAmount(amount: string | number): number;
};
