import { DocumentModificationOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import { MergeObjectOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/utils/helpers.mjs';
import { expandObjectsAndArrays } from '../../core/foundry/expandObjectsAndArrays';
import {
	BonusTarget,
	bonusTargets,
	byTarget,
	FeatureBonus,
	FeatureBonusWithContext,
	filterBonuses,
	sumFinalBonuses,
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

const singleItemTypes: Array<(itemSource: SourceConfig['Item']) => boolean> = [
	isClassSource,
	isRaceSource,
	isParagonPathSource,
	isEpicDestinySource,
];

const base = { condition: '' } as const;
const standardBonuses: FeatureBonus[] = [
	{ ...base, target: 'ability-str', amount: '@actor.data.data.abilities.str.base', type: 'base' },
	{ ...base, target: 'ability-con', amount: '@actor.data.data.abilities.con.base', type: 'base' },
	{ ...base, target: 'ability-dex', amount: '@actor.data.data.abilities.dex.base', type: 'base' },
	{ ...base, target: 'ability-int', amount: '@actor.data.data.abilities.int.base', type: 'base' },
	{ ...base, target: 'ability-wis', amount: '@actor.data.data.abilities.wis.base', type: 'base' },
	{ ...base, target: 'ability-cha', amount: '@actor.data.data.abilities.cha.base', type: 'base' },
	{ ...base, target: 'maxHp', amount: `10 + 2 * @actor.derivedData.abilities.con`, type: 'base' },
	{ ...base, target: 'surges-max', amount: '@actor.derivedData.abilities.con', type: 'ability' },
	{ ...base, target: 'defense-ac', amount: 10 },
	{ ...base, target: 'defense-ac', amount: '@actor.derivedData.abilities.dex', type: 'ability' },
	{ ...base, target: 'defense-fort', amount: 10 },
	{ ...base, target: 'defense-fort', amount: '@actor.derivedData.abilities.str', type: 'ability' },
	{ ...base, target: 'defense-fort', amount: '@actor.derivedData.abilities.con', type: 'ability' },
	{ ...base, target: 'defense-refl', amount: 10 },
	{ ...base, target: 'defense-refl', amount: '@actor.derivedData.abilities.dex', type: 'ability' },
	{ ...base, target: 'defense-refl', amount: '@actor.derivedData.abilities.int', type: 'ability' },
	{ ...base, target: 'defense-will', amount: 10 },
	{ ...base, target: 'defense-will', amount: '@actor.derivedData.abilities.wis', type: 'ability' },
	{ ...base, target: 'defense-will', amount: '@actor.derivedData.abilities.cha', type: 'ability' },
];

const setters: Record<BonusTarget, (data: ActorDerivedData, value: number) => void> = {
	'ability-str': (data, value) => (data.abilities.str = value),
	'ability-con': (data, value) => (data.abilities.con = value),
	'ability-dex': (data, value) => (data.abilities.dex = value),
	'ability-int': (data, value) => (data.abilities.int = value),
	'ability-wis': (data, value) => (data.abilities.wis = value),
	'ability-cha': (data, value) => (data.abilities.cha = value),
	'defense-ac': (data, value) => (data.defenses.ac = value),
	'defense-fort': (data, value) => (data.defenses.fort = value),
	'defense-refl': (data, value) => (data.defenses.refl = value),
	'defense-will': (data, value) => (data.defenses.will = value),
	maxHp: (data, value) => (data.health.maxHp = value),
	'surges-max': (data, value) => (data.health.surges.max = value),
	'surges-value': (data, value) => (data.health.surges.value = value),
	speed: (data, value) => (data.speed = value),
};

export class MashupActor extends Actor implements ActorDocument {
	override data!: PossibleActorData;
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

	override prepareDerivedData() {
		this._derivedData = null;
	}

	private calculateDerivedData(): ActorDerivedData {
		// TODO: this would be better as a proxy object
		const allBonuses = this.allBonuses;

		const resultData: ActorDerivedData = {
			abilities: {
				str: 0,
				con: 0,
				dex: 0,
				int: 0,
				wis: 0,
				cha: 0,
			},
			health: {
				maxHp: 0,
				bloodied: 0,
				surges: {
					value: 0,
					max: 0,
				},
			},
			defenses: {
				ac: 0,
				fort: 0,
				refl: 0,
				will: 0,
			},
			speed: 0,
		};
		this._derivedData = resultData;
		const groupedByTarget = byTarget(allBonuses);
		bonusTargets.forEach((target) => {
			const filtered = filterBonuses(groupedByTarget[target] ?? []);
			const evaluatedBonuses = evaluateAndRoll(filtered);
			const final = sumFinalBonuses(evaluatedBonuses);
			setters[target](resultData, final);
		});

		this.subActorFunctions.prepare(resultData, this);

		resultData.health.bloodied = Math.floor(resultData.health.maxHp / 2);
		resultData.health.surges.value = Math.floor(resultData.health.maxHp / 4);

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
