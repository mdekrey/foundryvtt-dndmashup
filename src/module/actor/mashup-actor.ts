import { DocumentModificationOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs';
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
import { findAppliedClass, findAppliedRace, isClassSource, isRaceSource } from './formulas';
import { PossibleActorData, SpecificActorData } from './types';

const singleItemTypes: Array<(itemSource: SourceConfig['Item']) => boolean> = [isClassSource, isRaceSource];

const standardBonuses: FeatureBonus[] = [
	{ target: 'ability-str', amount: '@actor.data.data.abilities.str.base', type: 'base' },
	{ target: 'ability-con', amount: '@actor.data.data.abilities.con.base', type: 'base' },
	{ target: 'ability-dex', amount: '@actor.data.data.abilities.dex.base', type: 'base' },
	{ target: 'ability-int', amount: '@actor.data.data.abilities.int.base', type: 'base' },
	{ target: 'ability-wis', amount: '@actor.data.data.abilities.wis.base', type: 'base' },
	{ target: 'ability-cha', amount: '@actor.data.data.abilities.cha.base', type: 'base' },
	{ target: 'maxHp', amount: `10 + 2 * @actor.data.data.abilities.con.final`, type: 'base' },
	{
		target: 'maxHp',
		amount: `@actor.appliedClass.data.data.hpBase + @actor.appliedClass.data.data.hpPerLevel * @actor.extraLevels`,
		type: 'class',
	},
	{
		target: 'surges-max',
		amount: `@actor.appliedClass.data.data.healingSurgesBase`,
		type: 'class',
	},
	{ target: 'surges-max', amount: '@actor.data.data.abilities.con.final', type: 'ability' },
	{ target: 'defense-ac', amount: 10 },
	{ target: 'defense-ac', amount: '@actor.data.data.abilities.dex.final', type: 'ability' },
	{ target: 'defense-fort', amount: 10 },
	{ target: 'defense-fort', amount: '@actor.data.data.abilities.str.final', type: 'ability' },
	{ target: 'defense-fort', amount: '@actor.data.data.abilities.con.final', type: 'ability' },
	{ target: 'defense-refl', amount: 10 },
	{ target: 'defense-refl', amount: '@actor.data.data.abilities.dex.final', type: 'ability' },
	{ target: 'defense-refl', amount: '@actor.data.data.abilities.int.final', type: 'ability' },
	{ target: 'defense-will', amount: 10 },
	{ target: 'defense-will', amount: '@actor.data.data.abilities.wis.final', type: 'ability' },
	{ target: 'defense-will', amount: '@actor.data.data.abilities.cha.final', type: 'ability' },
	{
		target: 'speed',
		amount: `@actor.appliedRace.data.data.baseSpeed`,
		type: 'racial',
	},
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

	get appliedClass() {
		return findAppliedClass(this.items);
	}
	get appliedRace() {
		return findAppliedRace(this.items);
	}

	get extraLevels() {
		return Math.max(1, this.data.data.details.level) - 1;
	}
	get tier() {
		return Math.floor(this.data.data.details.level / 10);
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
			...this.data.items.contents.flatMap((item) =>
				item.data.data.grantedBonuses.map((bonus) => ({ ...bonus, context: { actor: this, item } }))
			),
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

		if (this.data.type === 'pc') {
			this._prepareCharacterData(this.data);
		}
		if (this.data.type === 'monster') {
			this._prepareNpcData(this.data);
		}

		allData.data.health.bloodied = Math.floor(allData.data.health.maxHp / 2);
		allData.data.health.surges.value = Math.floor(allData.data.health.maxHp / 4);
	}

	private _prepareCharacterData(data: SpecificActorData<'pc'>) {
		// TODO: prepare PC-specific data

		data.data.details.class = this.appliedClass?.name || 'No class';
		data.data.details.race = this.appliedRace?.name || 'No race';
	}

	private _prepareNpcData(data: SpecificActorData<'monster'>) {
		// TODO: prepare NPC-specific data
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
}

export type SpecificActor<T extends PossibleActorData['type'] = PossibleActorData['type']> = MashupActor & {
	data: SpecificActorData<T>;
};
