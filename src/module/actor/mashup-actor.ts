import { DocumentModificationOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import { MergeObjectOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/utils/helpers.mjs';
import { expandObjectsAndArrays } from 'src/core/foundry/expandObjectsAndArrays';
import {
	BonusTarget,
	bonusTargets,
	byTarget,
	evaluateAndRoll,
	FeatureBonus,
	FeatureBonusWithContext,
	filterBonuses,
	sumFinalBonuses,
} from '../bonuses';
import { isClass, isEpicDestiny, isParagonPath, isRace } from '../item/subtypes';
import { isClassSource, isRaceSource, isParagonPathSource, isEpicDestinySource } from './formulas';
import { actorSubtypeConfig, SubActorFunctions } from './subtypes';
import { PossibleActorData, SpecificActorData } from './types';

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
	{ ...base, target: 'maxHp', amount: `10 + 2 * @actor.data.data.abilities.con.final`, type: 'base' },
	{ ...base, target: 'surges-max', amount: '@actor.data.data.abilities.con.final', type: 'ability' },
	{ ...base, target: 'defense-ac', amount: 10 },
	{ ...base, target: 'defense-ac', amount: '@actor.data.data.abilities.dex.final', type: 'ability' },
	{ ...base, target: 'defense-fort', amount: 10 },
	{ ...base, target: 'defense-fort', amount: '@actor.data.data.abilities.str.final', type: 'ability' },
	{ ...base, target: 'defense-fort', amount: '@actor.data.data.abilities.con.final', type: 'ability' },
	{ ...base, target: 'defense-refl', amount: 10 },
	{ ...base, target: 'defense-refl', amount: '@actor.data.data.abilities.dex.final', type: 'ability' },
	{ ...base, target: 'defense-refl', amount: '@actor.data.data.abilities.int.final', type: 'ability' },
	{ ...base, target: 'defense-will', amount: 10 },
	{ ...base, target: 'defense-will', amount: '@actor.data.data.abilities.wis.final', type: 'ability' },
	{ ...base, target: 'defense-will', amount: '@actor.data.data.abilities.cha.final', type: 'ability' },
];

const setters: Record<BonusTarget, (data: PossibleActorData, value: number) => void> = {
	'ability-str': (data, value) => (data.data.abilities.str.final = value),
	'ability-con': (data, value) => (data.data.abilities.con.final = value),
	'ability-dex': (data, value) => (data.data.abilities.dex.final = value),
	'ability-int': (data, value) => (data.data.abilities.int.final = value),
	'ability-wis': (data, value) => (data.data.abilities.wis.final = value),
	'ability-cha': (data, value) => (data.data.abilities.cha.final = value),
	'defense-ac': (data, value) => (data.data.defenses.ac = value),
	'defense-fort': (data, value) => (data.data.defenses.fort = value),
	'defense-refl': (data, value) => (data.data.defenses.refl = value),
	'defense-will': (data, value) => (data.data.defenses.will = value),
	maxHp: (data, value) => (data.data.health.maxHp = value),
	'surges-max': (data, value) => (data.data.health.surges.max = value),
	'surges-value': (data, value) => (data.data.health.surges.value = value),
	speed: (data, value) => (data.data.speed = value),
};

export class MashupActor extends Actor {
	data!: PossibleActorData;
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
		return this.items?.find(isClass);
	}
	get appliedRace() {
		return this.items?.find(isRace);
	}
	get appliedParagonPath() {
		return this.items?.find(isParagonPath);
	}
	get appliedEpicDestiny() {
		return this.items?.find(isEpicDestiny);
	}

	get extraLevels() {
		return Math.max(1, this.data.data.details.level) - 1;
	}
	get tier() {
		return Math.floor(this.data.data.details.level / 10);
	}

	get specialBonuses() {
		return this.data.items.contents.flatMap((item) =>
			item.allGrantedBonuses().map((bonus) => ({ ...bonus, context: { actor: this, item } }))
		);
	}

	/**
	 * @override
	 * Augment the basic actor data with additional dynamic data. Typically,
	 * you'll want to handle most of your calculated/derived data in this step.
	 * Data calculated in this step should generally not exist in template.json
	 * (such as ability modifiers rather than ability scores) and should be
	 * available both inside and outside of character sheets (such as if an actor
	 * is queried and has a roll executed directly from it).
	 */
	prepareDerivedData() {
		const allData = this.data;
		allData.data.defenses ??= {} as typeof allData.data.defenses;

		// all active effects and other linked objects should be loaded here
		const allBonuses: FeatureBonusWithContext[] = [
			...standardBonuses.map((bonus) => ({ ...bonus, context: { actor: this } })),
			...this.data._source.data.bonuses.map((bonus) => ({ ...bonus, context: { actor: this } })),
			...this.specialBonuses,
		];

		const groupedByTarget = byTarget(allBonuses);
		bonusTargets.forEach((target) => {
			const filtered = filterBonuses(groupedByTarget[target] ?? []);
			const evaluatedBonuses = evaluateAndRoll(filtered);
			const final = sumFinalBonuses(evaluatedBonuses);
			setters[target](allData, final);
		});

		allData.data.defenses ??= {} as typeof allData.data.defenses;

		if (allData._source.type !== allData.type) {
			// seriously, wtf?
			console.error('Got two different actor types:', allData._source.type, allData.type);
			return;
		}

		this.subActorFunctions.prepare(allData, this);

		allData.data.health.bloodied = Math.floor(allData.data.health.maxHp / 2);
		allData.data.health.surges.value = Math.floor(allData.data.health.maxHp / 4);
	}

	getRollData() {
		const data = super.getRollData();
		// see https://foundryvtt.wiki/en/development/guides/SD-tutorial/SD06-Extending-the-Actor-class#actorgetrolldata
		return data;
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

	override update(
		data?: DeepPartial<ActorDataConstructorData | (ActorDataConstructorData & Record<string, unknown>)>,
		context?: DocumentModificationContext & MergeObjectOptions
	): Promise<this | undefined> {
		// TODO: For Foundry v9, this is necessary. This appears to be fixed in v10
		const result = expandObjectsAndArrays(data as Record<string, unknown>) as ActorDataConstructorData;
		return super.update(result, context);
	}
}

export type SpecificActor<T extends PossibleActorData['type'] = PossibleActorData['type']> = MashupActor & {
	data: SpecificActorData<T>;
};
