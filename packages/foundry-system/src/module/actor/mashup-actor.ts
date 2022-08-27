import { DocumentModificationOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import { MergeObjectOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/utils/helpers.mjs';
import { ActiveEffectDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/activeEffectData';
import { FullFeatureBonus, FullDynamicListEntry } from '@foundryvtt-dndmashup/mashup-rules';
import { SimpleDocument, SimpleDocumentData } from '@foundryvtt-dndmashup/foundry-compat';
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
} from '@foundryvtt-dndmashup/mashup-react';
import { expandObjectsAndArrays } from '../../core/foundry';
import { isClassSource, isRaceSource, isParagonPathSource, isEpicDestinySource } from './formulas';
import { actorSubtypeConfig, SubActorFunctions } from './subtypes';
import { PossibleActorData, SpecificActorData } from './types';
import { calculateDerivedData } from './logic/calculateDerivedData';
import { updateBloodied } from './logic/updateBloodied';
import { BaseUser } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs';
import { createFinalEffectConstructorData } from './logic/createFinalEffectConstructorData';

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
	private prevHealth: number | undefined;
	override data!: PossibleActorData & { data: ActorDerivedData };
	subActorFunctions!: SubActorFunctions<PossibleActorData['type']>;
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
		this.subActorFunctions = actorSubtypeConfig[this.data.type] as typeof this.subActorFunctions;
		super.prepareData();
		this.handleHealthUpdate();
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

	get extraLevels() {
		return Math.max(1, this.data.data.details.level) - 1;
	}
	get tier() {
		return Math.floor((this.data.data.details.level - 1) / 10);
	}

	get specialBonuses(): FullFeatureBonus[] {
		return [
			// all active effects and other linked objects should be loaded here
			...this.effects.contents.flatMap((effect) =>
				effect.allBonuses().map((bonus) => ({ ...bonus, context: { actor: this }, source: effect }))
			),
			...this.data._source.data.bonuses.map((bonus) => ({ ...bonus, source: this, context: { actor: this } })),
			...this.data.items.contents.flatMap((item) =>
				item.allGrantedBonuses().map((bonus) => ({ ...bonus, context: { actor: this, item } }))
			),
		];
	}

	private _derivedData: ActorDerivedData | null = null;
	get derivedData(): ActorDerivedData {
		return this._derivedData ?? (this._derivedData = this.calculateDerivedData());
	}

	private _allBonuses: FullFeatureBonus[] | null = null;
	get allBonuses(): FullFeatureBonus[] {
		return this._allBonuses ?? (this._allBonuses = this.specialBonuses);
	}

	private _appliedBonuses: FullFeatureBonus[] | null = null;
	get appliedBonuses(): FullFeatureBonus[] {
		if (!this._appliedBonuses) this.calculateDerivedData();
		if (!this._appliedBonuses) throw new Error('Cannot access applied bonuses before loading is finished');
		return this._appliedBonuses;
	}
	private _indeterminateBonuses: FullFeatureBonus[] | null = null;
	get indeterminateBonuses(): FullFeatureBonus[] {
		if (!this._indeterminateBonuses) this.calculateDerivedData();
		if (!this._indeterminateBonuses) throw new Error('Cannot access indeterminate bonuses before loading is finished');
		return this._indeterminateBonuses;
	}

	get dynamicListResult(): FullDynamicListEntry[] {
		return [
			...this.data._source.data.dynamicList.map((bonus) => ({ ...bonus, source: this, context: { actor: this } })),
			...this.data.items.contents.flatMap((item) =>
				item.allDynamicList().map((entry) => ({ ...entry, context: { actor: this, item } }))
			),
		];
	}

	private _allDynamicListResult: FullDynamicListEntry[] | null = null;
	get allDynamicListResult(): FullDynamicListEntry[] {
		return this._allDynamicListResult ?? (this._allDynamicListResult = this.dynamicListResult);
	}

	private _appliedDynamicList: FullDynamicListEntry[] | null = null;
	get appliedDynamicList(): FullDynamicListEntry[] {
		if (!this._appliedDynamicList) this.calculateDerivedData();
		if (!this._appliedDynamicList) throw new Error('Cannot access applied DynamicList before loading is finished');
		return this._appliedDynamicList;
	}
	private _indeterminateDynamicList: FullDynamicListEntry[] | null = null;
	get indeterminateDynamicList(): FullDynamicListEntry[] {
		if (!this._indeterminateDynamicList) this.calculateDerivedData();
		if (!this._indeterminateDynamicList)
			throw new Error('Cannot access indeterminate DynamicList before loading is finished');
		return this._indeterminateDynamicList;
	}

	override prepareDerivedData() {
		this._allBonuses = null;
		this._derivedData = null;
		this._appliedBonuses = null;
		this._indeterminateBonuses = null;
		const derived = this.calculateDerivedData();
		mergeObject(this.data, { data: derived }, { recursive: true, inplace: true });
		if (this.isOwner) {
			updateBloodied.call(this);
		}
	}

	private handleHealthUpdate() {
		const newHealth = this.data.data.health.hp.value + this.data.data.health.temporaryHp;
		if (this.prevHealth !== undefined) {
			const dhp = newHealth - this.prevHealth;
			if (dhp !== 0) {
				const tokens = this.isToken ? [this.token?.object] : this.getActiveTokens(true);
				for (const t of tokens) {
					const hud: ObjectHUD | undefined = (t as any)?.hud;
					if (!hud?.createScrollingText) continue; // This is undefined prior to v9-p2
					const pct = Math.clamped(Math.abs(dhp) / this.data.data.health.hp.max, 0, 1);
					hud.createScrollingText(dhp.signedString(), {
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
			this.data.token.update({ vision: true, actorLink: true, disposition: 1 });
		}
	}

	async createActiveEffect(effect: ActiveEffectDataConstructorData, duration: ComputableEffectDurationInfo) {
		console.log({ effect, duration });
		await ActiveEffect.create(createFinalEffectConstructorData(effect, duration, this), { parent: this });
	}

	isStatus(statusToCheck: string): boolean {
		return !!this.effects.find((effect) => effect.data.flags.core?.statusId === statusToCheck);
	}

	private calculateDerivedData() {
		return calculateDerivedData.call(
			this,
			({ derivedData, appliedBonuses, indeterminateBonuses, appliedDynamicList, indeterminateDynamicList }) => {
				this._derivedData = derivedData;
				this._appliedBonuses = appliedBonuses;
				this._indeterminateBonuses = indeterminateBonuses;
				this._appliedDynamicList = appliedDynamicList;
				this._indeterminateDynamicList = indeterminateDynamicList;
			}
		);
	}

	allPowers() {
		return this.items.contents.flatMap((item: ItemDocument) => (isPower(item) ? item : item.allGrantedPowers()));
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
		const oldSingleItems = this.items.contents.filter((item) => itemTypesToRemove.some((t) => t(item.data._source)));
		oldSingleItems.forEach((item) => {
			console.log('Removing', item.name, item);
			item.delete();
		});
	}

	override async update(
		data?: DeepPartial<ActorDataConstructorData | (ActorDataConstructorData & Record<string, unknown>)>,
		context?: DocumentModificationContext & MergeObjectOptions
	): Promise<this | undefined> {
		// TODO: For Foundry v9, this is necessary. This appears to be fixed in v10
		const resultData = {
			...(expandObjectsAndArrays(data as Record<string, unknown>) as ActorDataConstructorData),
		};
		// Use embedded document creation process instead of update - this does weird/bad things. Plus, it's a huge recursive tree.
		if (resultData.items) delete resultData.items;
		if (resultData.effects) delete resultData.effects;

		if (!(this.parent instanceof Actor)) return super.update(resultData, context);
		await (this.parent as MashupActor).updateEmbeddedDocuments('Actor', [{ ...resultData, _id: this.id }]);
		this.render(false);
		return this;
	}

	showEditDialog() {
		this.sheet?.render(true, { focus: true });
	}

	equip(itemData: SimpleDocumentData<EquipmentData>, equipSlot: EquippedItemSlot) {
		const { equippedSlots, slotsNeeded } = getItemSlotInfo(itemData.data.itemSlot);

		const wasEquipped = itemData.data.equipped && itemData.data.equipped[0] === equipSlot;
		const next = wasEquipped ? [] : [equipSlot];
		if (!wasEquipped && slotsNeeded(getEquipmentProperties(itemData)) > 1) {
			next.push(...equippedSlots.filter((e) => e !== equipSlot));
		}
		const unequip = (this.items.contents as SimpleDocument[])
			.filter(isEquipment)
			.filter(
				(eq) => eq.id !== itemData._id && eq.data.data.equipped && next.some((p) => eq.data.data.equipped.includes(p))
			);

		this.updateEmbeddedDocuments('Item', [
			{ _id: itemData._id, data: { equipped: next } },
			...unequip.map(({ id }) => ({ _id: id, data: { equipped: [] } })),
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
		if (amount === 0 && !addHealingSurgeValue) {
			ui.notifications?.warn(`Healing amount was 0.`);
			return;
		}
		const health = this.data.data.health;

		if (spendHealingSurge && health.surgesRemaining.value <= 0) {
			ui.notifications?.warn(`Not enough healing surges available on ${this.name}.`);
			return;
		}

		const effectiveAmount = amount + (addHealingSurgeValue ? health.surgesValue : 0);

		const data: Partial<
			Record<'data.health.hp.value' | 'data.health.temporaryHp' | 'data.health.surgesRemaining.value', number>
		> = {
			...additionalUpdates,
		};
		if (spendHealingSurge) {
			data['data.health.surgesRemaining.value'] = health.surgesRemaining.value - 1;
		}
		if (isTemporary) {
			data['data.health.temporaryHp'] = health.temporaryHp + effectiveAmount;
		} else {
			data['data.health.hp.value'] = Math.min(health.hp.max, health.hp.value + effectiveAmount);
		}
		await this.update(data);
	}

	isReady(power: PowerDocument) {
		if (!this.data.data.powerUsage) return true;
		if (!power.powerGroupId) return false;

		const pools = power.data.data.usedPools;
		if (pools && pools.some((poolName) => this.isPoolDrained(poolName))) return false;

		if (power.data.data.usage === 'item' && this.data.data.magicItemUse.used >= this.data.data.magicItemUse.usesPerDay)
			return false;

		return !this.data.data.powerUsage[power.powerGroupId];
	}
	async toggleReady(power: PowerDocument): Promise<boolean> {
		// intentionally does not update pools
		await this.update({ [`data.powerUsage.${power.powerGroupId}`]: this.isReady(power) ? 1 : 0 });
		return true;
	}
	private static readonly trackedPowerUsage: PowerUsage[] = ['encounter', 'daily', 'item', 'item-healing-surge'];
	async applyUsage(power: PowerDocument): Promise<boolean> {
		if (!this.isReady(power)) return false;

		const updates: Record<string, unknown> = {};
		if (MashupActor.trackedPowerUsage.includes(power.data.data.usage)) {
			updates[`data.powerUsage.${power.powerGroupId}`] = this.isReady(power) ? 1 : 0;
		}
		const pools = power.data.data.usedPools;
		if (pools) {
			updates[`data.pools`] = this.data.data.pools.map((pool) => {
				return pools.includes(pool.name)
					? {
							...pool,
							usedSinceRest: pool.usedSinceRest + 1,
							value: pool.value - 1,
					  }
					: pool;
			});
		}

		if (power.data.data.usage === 'item') {
			updates[`data.magicItemUse.used`] = this.data.data.magicItemUse.used + 1;
		}

		await this.update(updates);

		return true;
	}

	isPoolDrained(poolName: string) {
		const pool = this.data.data.pools.find((p) => p.name === poolName);
		const poolMaxes = this.derivedData.poolLimits.find((p) => p.name === poolName);
		console.log(poolName, { pool, poolMaxes });
		if (!pool || !poolMaxes) return true;
		if (pool.value === 0) return true;
		if (poolMaxes.maxBetweenRest !== null && pool.usedSinceRest >= poolMaxes.maxBetweenRest) return true;
		console.log(poolName, 'not drained');
		return false;
	}
}

export type SpecificActor<T extends PossibleActorData['type'] = PossibleActorData['type']> = MashupActor & {
	data: SpecificActorData<T>;
};
