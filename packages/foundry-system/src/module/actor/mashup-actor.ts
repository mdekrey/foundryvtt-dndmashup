import { DocumentModificationOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import { MergeObjectOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/utils/helpers.mjs';
import { expandObjectsAndArrays } from '../../core/foundry/expandObjectsAndArrays';
import {
	abilities,
	AbilityBonus,
	BonusTarget,
	bonusTargets,
	byTarget,
	damageTypes,
	defenses,
	DefenseBonus,
	FeatureBonus,
	FeatureBonusWithContext,
	filterBonuses,
	Resistance,
	sumFinalBonuses,
	Vulnerability,
	ruleResultIndeterminate,
	ConditionRule,
} from '@foundryvtt-dndmashup/mashup-react';
import { isClass } from '@foundryvtt-dndmashup/mashup-react';
import { isEpicDestiny } from '@foundryvtt-dndmashup/mashup-react';
import { isEquipment } from '@foundryvtt-dndmashup/mashup-react';
import { isParagonPath } from '@foundryvtt-dndmashup/mashup-react';
import { isPower } from '@foundryvtt-dndmashup/mashup-react';
import { isRace } from '@foundryvtt-dndmashup/mashup-react';
import { isClassSource, isRaceSource, isParagonPathSource, isEpicDestinySource } from './formulas';
import { actorSubtypeConfig, SubActorFunctions } from './subtypes';
import { PossibleActorData, SpecificActorData } from './types';
import { ActorDerivedData } from '@foundryvtt-dndmashup/mashup-react';
import { ActorDocument } from '@foundryvtt-dndmashup/mashup-react';
import { EquippedItemSlot, getItemSlotInfo } from '@foundryvtt-dndmashup/mashup-react';
import { SimpleDocument, SimpleDocumentData } from '@foundryvtt-dndmashup/foundry-compat';
import { EquipmentData } from '@foundryvtt-dndmashup/mashup-react';
import { getEquipmentProperties } from '@foundryvtt-dndmashup/mashup-react';
import { ItemDocument } from '@foundryvtt-dndmashup/mashup-react';
import { evaluateAndRoll } from '../bonuses/evaluateAndRoll';
import { toObject } from '@foundryvtt-dndmashup/mashup-core';
import { isGame } from '../../core/foundry';
import { noop } from 'lodash/fp';

const singleItemTypes: Array<(itemSource: SourceConfig['Item']) => boolean> = [
	isClassSource,
	isRaceSource,
	isParagonPathSource,
	isEpicDestinySource,
];

function condition(text: string): { condition: ConditionRule } {
	return { condition: { rule: 'manual', parameter: { conditionText: text } } };
}

const base = { condition: null } as const;
const standardBonuses: FeatureBonus[] = [
	{ ...base, target: 'ability-str', amount: '@actor.data.data.abilities.str.base', type: 'base' },
	{ ...base, target: 'ability-con', amount: '@actor.data.data.abilities.con.base', type: 'base' },
	{ ...base, target: 'ability-dex', amount: '@actor.data.data.abilities.dex.base', type: 'base' },
	{ ...base, target: 'ability-int', amount: '@actor.data.data.abilities.int.base', type: 'base' },
	{ ...base, target: 'ability-wis', amount: '@actor.data.data.abilities.wis.base', type: 'base' },
	{ ...base, target: 'ability-cha', amount: '@actor.data.data.abilities.cha.base', type: 'base' },
	{ ...base, target: 'maxHp', amount: `10 + 2 * @actor.derivedData.abilities.con.total`, type: 'base' },
	{ ...base, target: 'surges-max', amount: '@actor.derivedData.abilities.con.total', type: 'ability' },
	{ ...base, target: 'defense-ac', amount: 10 },
	{ ...base, target: 'defense-ac', amount: '@actor.derivedData.abilities.dex.total', type: 'ability' },
	{ ...base, target: 'defense-fort', amount: 10 },
	{ ...base, target: 'defense-fort', amount: '@actor.derivedData.abilities.str.total', type: 'ability' },
	{ ...base, target: 'defense-fort', amount: '@actor.derivedData.abilities.con.total', type: 'ability' },
	{ ...base, target: 'defense-refl', amount: 10 },
	{ ...base, target: 'defense-refl', amount: '@actor.derivedData.abilities.dex.total', type: 'ability' },
	{ ...base, target: 'defense-refl', amount: '@actor.derivedData.abilities.int.total', type: 'ability' },
	{ ...base, target: 'defense-will', amount: 10 },
	{ ...base, target: 'defense-will', amount: '@actor.derivedData.abilities.wis.total', type: 'ability' },
	{ ...base, target: 'defense-will', amount: '@actor.derivedData.abilities.cha.total', type: 'ability' },
	{ ...base, target: 'initiative', amount: '@actor.derivedData.abilities.dex.total', type: 'ability' },

	{ ...condition('you have combat advantage against the target'), target: 'attack-roll', amount: 2 },
	{ ...condition('you are charging'), target: 'attack-roll', amount: 1 },
	{ ...condition('the target has concealment from you'), target: 'attack-roll', amount: -2 },
	{ ...condition('the target has total concealment from you'), target: 'attack-roll', amount: -5 },
	{ ...condition('the target has cover from you'), target: 'attack-roll', amount: -2 },
	{ ...condition('the target has superior cover from you'), target: 'attack-roll', amount: -5 },
	{ ...condition('the target is long range from you'), target: 'attack-roll', amount: -2 },
	{ ...condition('you are prone'), target: 'attack-roll', amount: -2 }, // TODO: automate
	{ ...condition('you are restrained'), target: 'attack-roll', amount: -2 }, // TODO: automate
	{ ...condition('you are running'), target: 'attack-roll', amount: -5 },
	{ ...condition('you are squeezing'), target: 'attack-roll', amount: -5 },
];

const setters: Record<BonusTarget, (data: ActorDerivedData, value: number) => void> = {
	...toObject(
		abilities,
		(abil): AbilityBonus => `ability-${abil}`,
		(abil) => (data, value) => (data.abilities[abil].total = value)
	),
	...toObject(
		defenses,
		(def): DefenseBonus => `defense-${def}`,
		(def) => (data, value) => (data.defenses[def] = value)
	),
	...toObject(
		damageTypes,
		(dmg): Resistance => `${dmg}-resistance`,
		(dmg) => (data, value) => (data.damageTypes[dmg].resistance = value)
	),
	...toObject(
		damageTypes,
		(dmg): Vulnerability => `${dmg}-vulnerability`,
		(dmg) => (data, value) => (data.damageTypes[dmg].vulnerability = value)
	),
	maxHp: (data, value) => (data.health.hp.max = value),
	'surges-max': (data, value) => (data.health.surgesRemaining.max = value),
	'surges-value': (data, value) => (data.health.surgesValue = value),
	speed: (data, value) => (data.speed = value),
	initiative: (data, value) => (data.initiative = value),

	'attack-roll': noop,
	damage: noop,
	'critical-damage': noop,
	healing: noop,
	'saving-throw': noop,
};

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
		return Math.floor(this.data.data.details.level / 10);
	}

	get specialBonuses(): FeatureBonusWithContext[] {
		return this.data.items.contents.flatMap((item) =>
			item.allGrantedBonuses().map((bonus) => ({ ...bonus, context: { actor: this, item } }))
		);
	}

	private _derivedData: ActorDerivedData | null = null;
	get derivedData(): ActorDerivedData {
		return this._derivedData ?? (this._derivedData = this.calculateDerivedData());
	}

	private _allBonuses: FeatureBonusWithContext[] | null = null;
	get allBonuses(): FeatureBonusWithContext[] {
		return (
			this._allBonuses ??
			(this._allBonuses = [
				// all active effects and other linked objects should be loaded here
				...standardBonuses.map((bonus) => ({ ...bonus, context: { actor: this } })),
				...this.data._source.data.bonuses.map((bonus) => ({ ...bonus, context: { actor: this } })),
				...this.specialBonuses,
			])
		);
	}

	private _appliedBonuses: FeatureBonusWithContext[] | null = null;
	get appliedBonuses(): FeatureBonusWithContext[] {
		if (!this._appliedBonuses) this.calculateDerivedData();
		if (!this._appliedBonuses) throw new Error('Cannot access applied bonuses before loading is finished');
		return this._appliedBonuses;
	}
	private _indeterminateBonuses: FeatureBonusWithContext[] | null = null;
	get indeterminateBonuses(): FeatureBonusWithContext[] {
		if (!this._indeterminateBonuses) this.calculateDerivedData();
		if (!this._indeterminateBonuses) throw new Error('Cannot access indeterminate bonuses before loading is finished');
		return this._indeterminateBonuses;
	}

	override prepareDerivedData() {
		this._allBonuses = null;
		this._derivedData = null;
		this._appliedBonuses = null;
		this._indeterminateBonuses = null;
		const derived = this.calculateDerivedData();
		mergeObject(this.data, { data: derived }, { recursive: true, inplace: true });
		if (this.isOwner) {
			this.updateBloodied();
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
		return {
			actor: this,
		};
	}

	async updateBloodied() {
		const findEffectId = (statusToCheck: string) => {
			return this.effects.find((effect) => effect.data.flags.core?.statusId === statusToCheck)?.id ?? null;
		};
		const setIfNotPresent = async (statusToCheck: string) => {
			if (!isGame(game)) return;

			const existingEffect = this.effects.find((x) => x.data.flags.core?.statusId === statusToCheck);
			if (existingEffect) return;

			const status = CONFIG.statusEffects.find((x) => x.id === statusToCheck);
			if (!status) return;

			const { _id, id, ...params } = status;

			const effect = {
				...params,
				label: status.label && game.i18n.localize(status.label),
				flags: {
					core: {
						statusId: statusToCheck,
					},
				},
			};
			await ActiveEffect.create(effect, { parent: this });
		};

		const calculated = this.calculateDerivedData();
		const shouldBeDead = this.data.data.health.hp.value <= 0 && this.data.type === 'monster';
		// const shouldBeDying = this.data.data.health.currentHp <= 0 && this.data.type === 'pc';
		const shouldBeBloodied = !shouldBeDead && calculated.health.bloodied > this.data.data.health.hp.value;

		const isBloodied = this.isStatus('bloodied');
		const isDead = this.isStatus('dead');
		// const currentDyingId = findEffectId('dying');

		if (isDead) return;

		if (shouldBeBloodied && !isBloodied) await setIfNotPresent('bloodied');
		if (!shouldBeBloodied && isBloodied)
			await this.deleteEmbeddedDocuments(
				'ActiveEffect',
				[findEffectId('bloodied')].filter((v): v is string => !!v)
			);

		if (shouldBeDead && !isDead) await setIfNotPresent('dead');
	}

	isStatus(statusToCheck: string): boolean {
		return !!this.effects.find((effect) => effect.data.flags.core?.statusId === statusToCheck);
	}

	private calculateDerivedData(): ActorDerivedData {
		// TODO: this would be better as a proxy object
		const allBonuses = this.allBonuses;

		const resultData: ActorDerivedData = {
			abilities: toObject(
				abilities,
				(abil) => abil,
				() => ({ total: 0 })
			),
			health: {
				hp: { max: 0 },
				bloodied: 0,
				surgesRemaining: {
					max: 0,
				},
				surgesValue: 0,
			},
			defenses: toObject(
				defenses,
				(def) => def,
				() => 0
			),
			damageTypes: toObject(
				damageTypes,
				(dmg) => dmg,
				() => ({ resistance: 0, vulnerability: 0 })
			),
			speed: 0,
			initiative: 0,
			size: this.appliedRace?.data.data.size ?? 'medium',
		};
		this._derivedData = resultData;
		const groupedByTarget = byTarget(allBonuses);
		const appliedBonuses: FeatureBonusWithContext[] = [];
		const indeterminateBonuses: FeatureBonusWithContext[] = [];
		this._appliedBonuses = appliedBonuses;
		this._indeterminateBonuses = indeterminateBonuses;
		bonusTargets.forEach((target) => {
			const filtered = filterBonuses(groupedByTarget[target] ?? [], {}, true);
			indeterminateBonuses.push(
				...filtered.filter(([, result]) => result === ruleResultIndeterminate).map(([bonus]) => bonus)
			);
			const applicable = filtered.filter(([, result]) => result === true).map(([bonus]) => bonus);
			appliedBonuses.push(...applicable);
			const evaluatedBonuses = evaluateAndRoll(applicable);
			const final = sumFinalBonuses(evaluatedBonuses);
			setters[target](resultData, final);
		});

		this.subActorFunctions.prepare(resultData, this);

		resultData.health.bloodied = Math.floor(resultData.health.hp.max / 2);
		resultData.health.surgesValue = Math.floor(resultData.health.hp.max / 4);

		return resultData;
	}

	allPowers() {
		return this.items.contents.flatMap((item: ItemDocument) => (isPower(item) ? item : item.allGrantedPowers()));
	}

	// override getRollData() {
	// 	const data = super.getRollData();
	// 	// see https://foundryvtt.wiki/en/development/guides/SD-tutorial/SD06-Extending-the-Actor-class#actorgetrolldata
	// 	return data;
	// }

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
}

export type SpecificActor<T extends PossibleActorData['type'] = PossibleActorData['type']> = MashupActor & {
	data: SpecificActorData<T>;
};
