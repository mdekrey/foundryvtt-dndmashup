import { NpcDataSourceData, PlayerCharacterDataSourceData } from 'src/template.types';
import { calculateMaxHp } from './formulas';
import { NpcDataProperties, PlayerCharacterDataProperties } from './types';

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

		// Make separate methods for each Actor type (character, npc, etc.) to keep
		// things organized.
		if (allData._source.type === 'pc' && allData.type === 'pc') {
			this._prepareCharacterData(allData._source.data, allData.data);
		}
		if (allData._source.type === 'npc' && allData.type === 'npc') {
			this._prepareNpcData(allData._source.data, allData.data);
		}
	}

	private _prepareCharacterData(source: Readonly<PlayerCharacterDataSourceData>, data: PlayerCharacterDataProperties) {
		// TODO: prepare PC-specific data

		data.health.maxHp = calculateMaxHp(data);
	}

	private _prepareNpcData(source: Readonly<NpcDataSourceData>, data: NpcDataProperties) {
		// TODO: prepare NPC-specific data

		data.health.maxHp = calculateMaxHp(data);
	}

	getRollData() {
		const data = super.getRollData();
		// see https://foundryvtt.wiki/en/development/guides/SD-tutorial/SD06-Extending-the-Actor-class#actorgetrolldata
		return data;
	}
}
