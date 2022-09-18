import { BaseDocument, SimpleDocument, SimpleDocumentData } from '@foundryvtt-dndmashup/foundry-compat';
import {
	BonusByType,
	DynamicListTarget,
	FullDynamicListEntry,
	FullFeatureBonus,
	FullTriggeredEffect,
	NumericBonusTarget,
	Size,
	SourcedPoolBonus,
	SourcedPoolLimits,
} from '@foundryvtt-dndmashup/mashup-rules';
import { ActiveEffectDocumentConstructorParams } from '../active-effect/types';
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

export type DerivedCacheType<TTarget, TResult, TModifier> = {
	getValue(target: TTarget): TResult;
	getApplied(target: TTarget): TModifier[];
	getIndeterminate(target: TTarget): TModifier[];

	// inspection only for display on character sheet
	getAll(): TModifier[];
};

export type DerivedCache = {
	bonuses: DerivedCacheType<NumericBonusTarget, number, FullFeatureBonus>;

	pools: {
		getPools(): string[];
	} & DerivedCacheType<string, SourcedPoolLimits, SourcedPoolBonus>;

	lists: DerivedCacheType<DynamicListTarget, string[], FullDynamicListEntry>;

	triggeredEffects: {
		getAll(): FullTriggeredEffect[];
	};
};

type CreateActiveEffectParams = [...params: ActiveEffectDocumentConstructorParams, sources: BaseDocument[]];

export type ActorDocument<T extends PossibleActorType = PossibleActorType> = SimpleDocument<ActorDataSource<T>> & {
	readonly derivedData: ActorDerivedData<T>;
	readonly token: null | TokenDocument;

	get mashupId(): string;

	get derivedCache(): DerivedCache;
	get halfLevel(): number;
	get milestones(): number;
	get size(): Size;

	allPowers(includeNestedPowers?: boolean): PowerDocument[];
	equip(itemData: SimpleDocumentData<EquipmentData>, equipSlot: EquippedItemSlot): void;
	isReady(power: PowerDocument): boolean;
	toggleReady(power: PowerDocument): Promise<boolean>;
	applyUsage(power: PowerDocument): Promise<boolean>;
	spendActionPoint(): Promise<null | string[]>;

	applyHealing(options: HealingOptions): Promise<void>;

	createActiveEffect(...params: CreateActiveEffectParams): Promise<void>;

	applyShortRest(healingSurges: number, healingBonusByType: BonusByType): Promise<boolean>;
	applyLongRest(): Promise<boolean>;

	importChildItem(type?: PossibleItemType): Promise<void>;

	evaluateAmount(amount: string | number): number;

	simplifyAmount(amount: string): string;
	simplifyAmount(amount: string | number): string | number;
};
