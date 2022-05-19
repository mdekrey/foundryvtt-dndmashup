import { MonsterDataSourceData, PlayerCharacterDataSourceData } from 'src/template.types';
import { calculateMaxHp } from './formulas';
import { MonsterDataProperties, PlayerCharacterDataProperties } from './types';

export class MashupActor extends Actor {
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
		console.log({ type: allData._source.type, source: allData._source.data, data: allData.data });

		if (allData._source.type !== allData.type) {
			// seriously, wtf?
			console.error('Got two different actor types:', allData._source.type, allData.type);
			return;
		}

		allData.data.defenses ??= {} as typeof allData.data.defenses;

		if (allData._source.type === 'pc' && allData.type === 'pc') {
			this._prepareCharacterData(allData._source.data, allData.data);
		}
		if (allData._source.type === 'monster' && allData.type === 'monster') {
			this._prepareNpcData(allData._source.data, allData.data);
		}
	}

	private _prepareCharacterData(source: Readonly<PlayerCharacterDataSourceData>, data: PlayerCharacterDataProperties) {
		// TODO: prepare PC-specific data

		data.health.maxHp = calculateMaxHp(data);
		data.health.bloodied = Math.floor(data.health.maxHp / 2);
		data.health.surges.value = Math.floor(data.health.maxHp / 4);
		data.health.surges.max = 1;
		data.defenses.ac = 10;
		data.defenses.fort = 10;
		data.defenses.refl = 10;
		data.defenses.will = 10;
		console.log(data);
	}

	private _prepareNpcData(source: Readonly<MonsterDataSourceData>, data: MonsterDataProperties) {
		// TODO: prepare NPC-specific data

		data.health.maxHp = calculateMaxHp(data);
		data.health.bloodied = Math.floor(data.health.maxHp / 2);
		data.health.surges.value = Math.floor(data.health.maxHp / 4);
		data.health.surges.max = 0;
		data.defenses.ac = 10;
		data.defenses.fort = 10;
		data.defenses.refl = 10;
		data.defenses.will = 10;
	}

	getRollData() {
		const data = super.getRollData();
		// see https://foundryvtt.wiki/en/development/guides/SD-tutorial/SD06-Extending-the-Actor-class#actorgetrolldata
		return data;
	}
}
