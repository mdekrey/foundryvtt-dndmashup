import { DocumentModificationOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import { MergeObjectOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/utils/helpers.mjs';
import {
	BonusByType,
	combineRollComponents,
	fromBonusesToFormula,
	isRegainPoolRecharge,
	FullAura,
	Size,
	AuraEffect,
	isRuleApplicable,
	UnappliedAura,
} from '@foundryvtt-dndmashup/mashup-rules';
import { BaseDocument, SimpleDocument, SimpleDocumentData } from '@foundryvtt-dndmashup/foundry-compat';
import {
	isClass,
	PowerDocument,
	isEpicDestiny,
	isEquipment,
	isParagonPath,
	isPower,
	isRace,
	ActorDerivedData,
	ActorDocument,
	EquippedItemSlot,
	getItemSlotInfo,
	EquipmentData,
	getEquipmentProperties,
	ItemDocument,
	ComputableEffectDurationInfo,
	PowerUsage,
	PossibleItemType,
	toComputable,
	ActiveEffectDocumentConstructorData,
	DerivedCache,
	ActiveEffectDocumentConstructorParams,
	emptyConditionContext,
	ActorDataSource,
	ActorSystemData,
	PossibleActorType,
	PossibleItemDataSource,
} from '@foundryvtt-dndmashup/mashup-react';
import { expandObjectsAndArrays, isGame, toMashupId } from '../../core/foundry';
import { isClassSource, isRaceSource, isParagonPathSource, isEpicDestinySource } from './formulas';
import { actorSubtypeConfig, SubActorFunctions } from './subtypes';
import { calculateDerivedData, DerivedTotals } from './logic/calculateDerivedData';
import { updateBloodied } from './logic/updateBloodied';
import { BaseUser } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs';
import { createFinalEffectConstructorData } from './logic/createFinalEffectConstructorData';
import { importNewChildItem } from '../../core/foundry/importNewChildItem';
import { MashupItemEquipment } from '../item/subtypes/equipment/class';
import { isActorType } from './templates/isActorType';
import { simplifyDice } from '../dice';
import { MashupActiveEffect } from '../active-effect';
import { sendPlainChatMesage } from '../chat/sendChatMessage';

const singleItemTypes: Array<(itemSource: SourceConfig['Item']) => boolean> = [
	isClassSource,
	isRaceSource,
	isParagonPathSource,
	isEpicDestinySource,
];

const tokenHpColors = {
	damage: 0xff0000,
	healing: 0x00ff00,
	temp: 0x66ccff,
	tempmax: 0x440066,
	negmax: 0x550000,
};

export class MashupActor extends Actor implements ActorDocument {
	private _isInitialized!: true | undefined; // will be undefined for first initialization
	private prevHealth: number | undefined;
	_source!: SimpleDocumentData<ActorDataSource>;
	system!: ActorSystemData & ActorDerivedData;
	subActorFunctions!: SubActorFunctions<PossibleActorType>;
	prototypeToken!: TokenDocument; // FIXME: Foundry 10 added this, but it is PrototypeToken, not a TokenDocument, but this is close enough for us

	get isInitialized() {
		return this._isInitialized ?? false;
	}

	/*
	A few more methods:
	- prepareData - performs:
		- data reset
		- prepareBaseData()
		- prepareEmbeddedDocuments()
		- prepareDerivedData().
	- prepareBaseData()
		- can use _source.data/data but has no access to embedded documents
		- can be overridden
	 */

	override prepareData(): void {
		this.subActorFunctions = actorSubtypeConfig[this.type] as typeof this.subActorFunctions;
		super.prepareData();
		this.handleHealthUpdate();
	}

	get mashupId(): string {
		return toMashupId(this);
	}

	get displayName() {
		return this.name;
	}

	get appliedClass() {
		return (this.items.contents as SimpleDocument[]).find(isClass);
	}
	get appliedRace() {
		return (this.items.contents as SimpleDocument[]).find(isRace);
	}
	get appliedParagonPath() {
		return (this.items.contents as SimpleDocument[]).find(isParagonPath);
	}
	get appliedEpicDestiny() {
		return (this.items.contents as SimpleDocument[]).find(isEpicDestiny);
	}

	get halfLevel() {
		return Math.floor(this.system.details.level / 2);
	}
	get milestones() {
		return Math.floor((this.system.encountersSinceLongRest ?? 0) / 2);
	}
	get size(): Size {
		return isActorType(this, 'pc')
			? this.appliedRace?.system.size ?? 'medium'
			: isActorType(this, 'monster')
			? this._source.system.size
			: 'medium';
	}

	get extraLevels() {
		return Math.max(1, this.system.details.level) - 1;
	}
	get tier() {
		return Math.floor((this.system.details.level - 1) / 10);
	}

	private _derivedCache: DerivedCache = new DerivedTotals(this);
	get derivedCache(): DerivedCache {
		return this._derivedCache;
	}

	private _derivedData: ActorDerivedData | undefined;
	get derivedData(): ActorDerivedData {
		if (this._derivedData === undefined) {
			throw new Error('potentially recursive - should not happen');
		}
		return this._derivedData;
	}

	protected override _initialize(): void {
		super._initialize();
		this._isInitialized = true;
	}

	override prepareDerivedData() {
		this.recalculateDerived();
		if (isGame(game) ? game.user?.isGM : this.isOwner) {
			updateBloodied.call(this);
		}
	}

	updateAuras() {
		this.recalculateDerived();
		if (this.sheet?.rendered) {
			this.sheet.render(true);
		}
	}

	private recalculateDerived() {
		this._derivedCache = new DerivedTotals(this);
		this._derivedData = calculateDerivedData.call(this);
		mergeObject(this.system, this._derivedData, { recursive: true, inplace: true });
	}

	private handleHealthUpdate() {
		const newHealth = this.system.health.hp.value + this.system.health.temporaryHp;
		if (this.prevHealth !== undefined) {
			const dhp = newHealth - this.prevHealth;
			if (dhp !== 0) {
				const tokens = this.isToken ? [this.token?.object] : this.getActiveTokens(true);
				console.log(this, dhp, tokens);
				for (const t of tokens) {
					if (!t) continue;
					const pct = Math.clamped(Math.abs(dhp) / this.system.health.hp.max, 0, 1);
					(canvas?.interface as any)?.createScrollingText(t.center, dhp.signedString(), {
						anchor: CONST.TEXT_ANCHOR_POINTS.TOP,
						fontSize: 16 + 32 * pct, // Range between [16, 48]
						fill: tokenHpColors[dhp < 0 ? 'damage' : 'healing'],
						stroke: 0x000000,
						strokeThickness: 4,
						jitter: 0.25,
					});
				}
			}
		}

		this.prevHealth = newHealth;
	}

	override getRollData() {
		return { actor: this };
	}

	protected override async _preCreate(
		data: ActorDataConstructorData,
		options: DocumentModificationOptions,
		user: BaseUser
	): Promise<void> {
		if (this.type === 'pc') {
			// F10 TODO: this moved to prototypeToken
			this.prototypeToken.update({ vision: true, actorLink: true, disposition: 1 });
		}
	}

	async removeActiveEffects(ids: string[]) {
		const withAfterEffects = ids
			.map((id) => this.effects.get(id))
			.filter((effect): effect is MashupActiveEffect => !!effect)
			.map((effect) => [effect, effect.flags.mashup?.afterEffect] as const);
		const toDelete = withAfterEffects
			.filter(([effect, afterEffect]) => !afterEffect)
			.map(([effect]) => effect.id as string);
		const toUpdate = withAfterEffects
			.filter((t): t is [MashupActiveEffect, ActiveEffectDocumentConstructorParams] => !!t[1])
			.map(
				([effect, afterEffect]) =>
					[effect, createFinalEffectConstructorData(afterEffect, this, effect.flags.mashup?.originalSources)] as const
			);
		if (toUpdate.length)
			for (const [effect, data] of toUpdate) {
				await effect.update(data, {
					overwrite: true,
					diff: false,
					recursive: false,
				});
			}
		if (toDelete.length) await this.deleteEmbeddedDocuments('ActiveEffect', toDelete);
	}

	async createActiveEffect(
		effect: ActiveEffectDocumentConstructorData,
		duration: ComputableEffectDurationInfo,
		useStandardStats: boolean,
		sources: BaseDocument[]
	) {
		if (effect.flags?.core?.statusId) {
			const toRemove = this.effects.filter(
				(oldEffect) => oldEffect.flags?.core?.statusId === effect.flags?.core?.statusId
			);
			if (toRemove.length) {
				console.log(toRemove);
				await this.deleteEmbeddedDocuments(
					'ActiveEffect',
					toRemove.map((e) => e.id).filter((id): id is string => !!id)
				);
			}
		}
		const result = createFinalEffectConstructorData(
			[effect, duration, useStandardStats],
			this,
			sources.map(toMashupId)
		);
		await ActiveEffect.create(result, {
			parent: this,
		});
	}

	isStatus(statusToCheck: string): boolean {
		return !!this.effects.find((effect) => effect.flags.core?.statusId === statusToCheck);
	}

	allPowers(includeNestedPowers = true): PowerDocument[] {
		return this.items.contents.flatMap((item: ItemDocument) =>
			isPower(item) && (!includeNestedPowers || (item.system.effects?.length ?? 0) > 0) ? item : item.allGrantedPowers()
		);
	}

	get hasAuras() {
		return this.items.contents.flatMap((item: ItemDocument) => item.allGrantedAuras()).some(Boolean);
	}

	getAuras(predicate: (aura: AuraEffect) => boolean): FullAura[] {
		const auras: UnappliedAura[] = [
			...this.items.contents.flatMap((item: ItemDocument) =>
				item.allGrantedAuras().map((aura) => ({ ...aura, context: { ...emptyConditionContext, actor: this, item } }))
			),
			...this.effects.contents.flatMap((effect) =>
				effect.allAuras().map(
					(aura): UnappliedAura => ({
						...aura,
						context: { ...emptyConditionContext, actor: this },
						sources: [effect],
					})
				)
			),
		];
		return auras
			.filter(predicate)
			.filter((aura) => aura.condition === null || isRuleApplicable(aura.condition, aura.context))
			.map(({ range, ...aura }): FullAura => {
				return {
					...aura,
					bonuses:
						aura.bonuses?.map(({ amount, ...bonus }) => ({
							...bonus,
							amount: this.simplifyAmount(amount),
						})) ?? [],
					range: typeof range === 'string' ? this.evaluateAmount(range) : range,
					sources: [this, ...aura.sources],
				};
			});
	}

	/** When adding a new embedded document, clean up others of the same type */
	protected override _preCreateEmbeddedDocuments(
		embeddedName: string,
		result: Record<string, unknown>[],
		options: DocumentModificationOptions,
		userId: string
	): void {
		super._preCreateEmbeddedDocuments(embeddedName, result, options, userId);
		const itemTypesToRemove = singleItemTypes.filter((type) => result.some((i) => type(i as SourceConfig['Item'])));
		const oldSingleItems = this.items.contents.filter((item) =>
			itemTypesToRemove.some((t) => t(item._source as PossibleItemDataSource))
		);
		oldSingleItems.forEach((item) => {
			console.log('Removing', item.name, item);
			item.delete();
		});
	}

	override async update(
		changes?: DeepPartial<ActorDataConstructorData | (ActorDataConstructorData & Record<string, unknown>)>,
		context?: DocumentModificationContext & MergeObjectOptions & { ignoreEmbedded?: boolean }
	): Promise<this | undefined> {
		// TODO: For Foundry v9, this is necessary. This may be fixed in v10 (FIXME: check this)
		const resultData = {
			...(expandObjectsAndArrays(changes as Record<string, unknown>) as ActorDataConstructorData),
		};
		if (context?.ignoreEmbedded) {
			// Use embedded document creation process instead of update - this does weird/bad things. Plus, it's a huge recursive tree.
			if (resultData.items) delete resultData.items;
			if (resultData.effects) delete resultData.effects;
		}

		if (!(this.parent instanceof Actor)) return super.update(resultData, context);
		await (this.parent as MashupActor).updateEmbeddedDocuments('Actor', [{ ...resultData, _id: this.id }]);
		this.render(false);
		return this;
	}

	showEditDialog() {
		this.sheet?.render(true, { focus: true });
	}

	equip(itemData: SimpleDocumentData<EquipmentData>, equipSlot: EquippedItemSlot) {
		const { equippedSlots, slotsNeeded } = getItemSlotInfo(itemData.system.itemSlot);

		const wasEquipped = itemData.system.equipped && itemData.system.equipped[0] === equipSlot;
		const next = wasEquipped ? [] : [equipSlot];
		if (!wasEquipped && slotsNeeded(getEquipmentProperties(itemData)) > 1) {
			next.push(...equippedSlots.filter((e) => e !== equipSlot));
		}
		const unequip = (this.items.contents as SimpleDocument[])
			.filter(isEquipment)
			.filter((eq) => eq.id !== itemData._id && eq.system.equipped && next.some((p) => eq.system.equipped.includes(p)));

		this.updateEmbeddedDocuments('Item', [
			{ _id: itemData._id, system: { equipped: next } },
			...unequip.map(({ id }) => ({ _id: id, system: { equipped: [] } })),
		]);
	}

	async applyHealing({
		amount = 0,
		isTemporary = false,
		addHealingSurgeValue = false,
		spendHealingSurge = false,
		additionalUpdates = {},
	}: {
		amount?: number;
		isTemporary?: boolean;
		addHealingSurgeValue?: boolean;
		spendHealingSurge?: boolean;
		additionalUpdates?: Record<string, unknown>;
	}) {
		if (isNaN(amount)) return;
		if (amount === 0 && !addHealingSurgeValue) {
			ui.notifications?.warn(`Healing amount was 0.`);
			return;
		}
		const health = this.system.health;

		if (spendHealingSurge && health.surgesRemaining.value <= 0) {
			ui.notifications?.warn(`Not enough healing surges available on ${this.name}.`);
			return;
		}

		const effectiveAmount = amount + (addHealingSurgeValue ? this.derivedCache.bonuses.getValue('surges-value') : 0);

		const changes: Partial<
			Record<'system.health.hp.value' | 'system.health.temporaryHp' | 'system.health.surgesRemaining.value', number>
		> = {
			...additionalUpdates,
		};
		if (spendHealingSurge) {
			changes['system.health.surgesRemaining.value'] = health.surgesRemaining.value - 1;
		}
		if (isTemporary) {
			changes['system.health.temporaryHp'] = Math.max(health.temporaryHp, effectiveAmount);
			await sendPlainChatMesage(this, `${this.displayName} "gained" ${effectiveAmount} temporary hit points.`);
		} else {
			changes['system.health.hp.value'] = Math.min(health.hp.max, health.hp.value + effectiveAmount);
			await sendPlainChatMesage(this, `${this.displayName} healed ${effectiveAmount} hit points.`);
		}
		await this.update(changes);
	}

	isReady(power: PowerDocument) {
		if (!this.system.powerUsage) return true;
		if (!power.powerGroupId) return false;

		const pools = power.system.usedPools;
		if (pools && pools.some((poolName) => this.isPoolDrained(poolName))) return false;

		if (
			power.system.usage === 'item' &&
			this.system.magicItemUse.used >= this.derivedCache.bonuses.getValue('magic-item-uses')
		)
			return false;

		if (
			power.system.usage === 'item-consumable' &&
			(!(power.parent instanceof MashupItemEquipment) || (power.parent as MashupItemEquipment).system.quantity < 1)
		)
			return false;

		return !this.system.powerUsage[power.powerGroupId];
	}
	async toggleReady(power: PowerDocument): Promise<boolean> {
		// intentionally does not update pools
		await this.update({ [`system.powerUsage.${power.powerGroupId}`]: this.isReady(power) ? 1 : 0 });
		return true;
	}
	private static readonly trackedPowerUsage: PowerUsage[] = ['encounter', 'daily', 'item', 'item-healing-surge'];
	async applyUsage(power: PowerDocument): Promise<boolean> {
		if (!this.isReady(power)) return false;

		const updates: Record<string, unknown> = {};
		if (MashupActor.trackedPowerUsage.includes(power.system.usage)) {
			updates[`system.powerUsage.${power.powerGroupId}`] = this.isReady(power) ? 1 : 0;
		}
		const pools = power.system.usedPools;
		if (pools) {
			updates[`system.pools`] = this.system.pools.map((pool) => {
				return pools.includes(pool.name)
					? {
							...pool,
							usedSinceRest: pool.usedSinceRest + 1,
							value: pool.value - 1,
					  }
					: pool;
			});
		}

		if (power.system.usage === 'item') {
			updates[`system.magicItemUse.used`] = this.system.magicItemUse.used + 1;
		}

		if (Object.keys(updates).length) await this.update(updates);

		if (power.system.usage === 'item-consumable' && power.parent instanceof MashupItemEquipment)
			await (power.parent as MashupItemEquipment).decreaseQuantity(1);

		if (power.system.selfApplied) {
			await this.createActiveEffect(...toComputable(power.system.selfApplied, this, power.img ?? ''), [this, power]);
		}

		return true;
	}

	isPoolDrained(poolName: string) {
		const pool = this.system.pools.find((p) => p.name === poolName);
		const poolMaxes = this.derivedCache.pools.getValue(poolName);
		if (!pool || !poolMaxes) return true;
		if (pool.value === 0) return true;
		if (poolMaxes.maxBetweenRest !== null && pool.usedSinceRest >= poolMaxes.maxBetweenRest) return true;
		return false;
	}

	async spendActionPoint(): Promise<null | string[]> {
		if (this.system.actionPoints.value === 0) return null;

		const descriptions: string[] = [];
		const updates = {
			'system.actionPoints.usedThisEncounter': true,
			'system.actionPoints.value': this.system.actionPoints.value - 1,
		};
		Hooks.callAll<'preActionPointSpent'>('preActionPointSpent', this, updates, descriptions);

		await this.update(updates, {});

		Hooks.callAll('actionPointSpent', this);

		return descriptions;
	}

	async applyShortRest(healingSurges: number, healingBonusByType: BonusByType) {
		const health = this.system.health;
		if (healingSurges > health.surgesRemaining.value) return false;

		const effectiveHealingSurgeValue = combineRollComponents(
			this.derivedCache.bonuses.getValue('surges-value'),
			fromBonusesToFormula(healingBonusByType)
		);

		if (typeof effectiveHealingSurgeValue === 'string') {
			// TODO: do we need to support non-deterministic healing surge values?
			return false;
		}
		const effectiveAmount = healingSurges * effectiveHealingSurgeValue;

		const changes: Record<string, unknown> = {};
		changes['system.health.hp.value'] = Math.min(health.hp.max, health.hp.value + effectiveAmount);
		changes['system.health.surgesRemaining.value'] = health.surgesRemaining.value - healingSurges;
		changes['system.health.secondWindUsed'] = false;
		changes['system.actionPoints.usedThisEncounter'] = false;
		changes['system.health.deathSavesRemaining'] = 3;

		this.updatePoolRests('shortRest', changes);
		this.updatePowersForShortRest(changes);

		// TODO: what else?

		await this.update(changes);

		const toRemove = this.effects
			.filter((e) => e.flags?.mashup?.effectDuration?.durationType === 'shortRest')
			.map((e) => e.id)
			.filter((id): id is string => !!id);
		await this.deleteEmbeddedDocuments('ActiveEffect', toRemove);

		return true;
	}

	async applyLongRest() {
		const changes: Record<string, unknown> = {};
		changes['system.health.hp.value'] = this.system.health.hp.max;
		changes['system.health.surgesRemaining.value'] = this.derivedData.health.surgesRemaining.max;
		changes['system.health.secondWindUsed'] = false;
		changes['system.actionPoints.usedThisEncounter'] = false;
		changes['system.health.deathSavesRemaining'] = 3;
		changes['system.actionPoints.value'] = 1;
		changes['system.encountersSinceLongRest'] = 0;
		changes['system.magicItemUse.used'] = 0;

		this.updatePoolRests('longRest', changes);
		this.updatePowersForLongRest(changes);

		// TODO: what else?

		await this.update(changes);

		const toRemove = this.effects
			.filter(
				(e) =>
					e.flags?.mashup?.effectDuration?.durationType === 'shortRest' ||
					e.flags?.mashup?.effectDuration?.durationType === 'longRest'
			)
			.map((e) => e.id)
			.filter((id): id is string => !!id);
		await this.deleteEmbeddedDocuments('ActiveEffect', toRemove);

		return true;
	}

	updatePoolRests(restType: 'shortRest' | 'longRest', changes: Record<string, unknown>) {
		const poolsResult = deepClone(this.system.pools ?? []);
		for (const poolName of this.derivedCache.pools.getPools()) {
			const pool = this.derivedCache.pools.getValue(poolName);
			let poolValue = poolsResult.find((p) => p.name === pool.name);
			if (poolValue === undefined) {
				poolValue = { name: pool.name, value: pool.max ?? 0, usedSinceRest: 0 };
				poolsResult.push(poolValue);
			}
			poolValue.usedSinceRest = 0;

			let logic = pool[restType];
			if (logic === null && restType === 'longRest') logic = pool.shortRest;
			if (logic === null) continue;
			let newValue = poolValue.value;
			if (isRegainPoolRecharge(logic)) {
				newValue += logic.regain;
			} else {
				newValue = logic.reset;
			}
			poolValue.value = pool.max === null ? newValue : Math.max(pool.max, newValue);
		}
		changes['system.pools'] = poolsResult;
	}

	updatePowersForShortRest(changes: Record<string, unknown>) {
		for (const power of this.allPowers(true)) {
			if (power.system.usage === 'encounter' || power.system.usage.startsWith('recharge-'))
				changes[`system.powerUsage.${power.powerGroupId}`] = 0;
		}
	}
	updatePowersForLongRest(changes: Record<string, unknown>) {
		for (const power of this.allPowers(true)) {
			changes[`system.powerUsage.${power.powerGroupId}`] = 0;
		}
	}

	async importChildItem(type?: PossibleItemType): Promise<void> {
		importNewChildItem(this, type);
	}

	evaluateAmount(amount: string | number) {
		return typeof amount === 'number' ? amount : new Roll(amount, { actor: this }).roll({ async: false })._total;
	}

	simplifyAmount(amount: string): string;
	simplifyAmount(amount: string | number): string | number;
	simplifyAmount(amount: string | number): string | number {
		return typeof amount === 'string' ? simplifyDice(amount, { actor: this }) : amount;
	}
}

export type SpecificActor<T extends PossibleActorType = PossibleActorType> = MashupActor & {
	type: T;
	_source: ActorDataSource<T>;
	system: ActorSystemData<T> & ActorDerivedData;
};
