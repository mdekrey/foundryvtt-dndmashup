import { DocumentModificationOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs';
import { Abilities } from 'src/types/types';
import { calculateMaxHp, findAppliedClass, findAppliedRace } from './formulas';
import { PossibleActorData, SpecificActorData } from './types';

const singleItemTypes = ['class', 'race'] as const;

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

		// all active effects and other linked objects should be loaded here

		if (allData._source.type !== allData.type) {
			// seriously, wtf?
			console.error('Got two different actor types:', allData._source.type, allData.type);
			return;
		}

		allData.data.defenses ??= {} as typeof allData.data.defenses;

		if (this.data.type === 'pc') {
			this._prepareCharacterData(this.data);
		}
		if (this.data.type === 'monster') {
			this._prepareNpcData(this.data);
		}
	}

	private _prepareCharacterData(data: SpecificActorData<'pc'>) {
		// TODO: prepare PC-specific data

		// TODO: modifiers
		Abilities.forEach((ability) => {
			data.data.abilities[ability].final = data.data.abilities[ability].base;
		});

		data.data.health.maxHp = calculateMaxHp(data.data, this.items);
		data.data.health.bloodied = Math.floor(data.data.health.maxHp / 2);
		data.data.health.surges.value = Math.floor(data.data.health.maxHp / 4);

		data.data.details.class = this.appliedClass?.name || 'No class';
		data.data.details.race = this.appliedRace?.name || 'No race';

		// TODO: modifiers
		data.data.health.surges.max = 1;
		data.data.defenses.ac = 10;
		data.data.defenses.fort = 10;
		data.data.defenses.refl = 10;
		data.data.defenses.will = 10;
	}

	private _prepareNpcData(data: SpecificActorData<'monster'>) {
		// TODO: prepare NPC-specific data

		// TODO: modifiers
		Abilities.forEach((ability) => {
			data.data.abilities[ability].final = data.data.abilities[ability].base;
		});

		data.data.health.maxHp = calculateMaxHp(data.data);
		data.data.health.bloodied = Math.floor(data.data.health.maxHp / 2);
		data.data.health.surges.value = Math.floor(data.data.health.maxHp / 4);
		// TODO: modifiers
		data.data.health.surges.max = 0;
		data.data.defenses.ac = 10;
		data.data.defenses.fort = 10;
		data.data.defenses.refl = 10;
		data.data.defenses.will = 10;
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
		const itemTypesToRemove = singleItemTypes.filter((type) => result.some((i) => i.type === type));
		const oldSingleItems = this.items.contents.filter((item) => itemTypesToRemove.includes(item.type));
		oldSingleItems.forEach((item) => {
			console.log('Removing', item.name, item);
			item.delete();
		});
	}
}

export type SpecificActor<T extends PossibleActorData['type'] = PossibleActorData['type']> = MashupActor & {
	data: SpecificActorData<T>;
};
