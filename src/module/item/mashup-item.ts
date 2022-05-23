import { FeatureBonus } from '../bonuses';
import { ClassDataProperties, PossibleItemData, RaceDataProperties, SpecificItemData } from './types';

export class MashupItem extends Item {
	data!: PossibleItemData;

	allGrantedBonuses() {
		const result = [
			...this.data.data.grantedBonuses,
			...(this.data.type === 'class' ? MashupItem.classModifiers(this.data.data) : []),
			...(this.data.type === 'race' ? MashupItem.raceModifiers(this.data.data) : []),
		];

		return result;
	}

	static classModifiers(data: ClassDataProperties): FeatureBonus[] {
		return [
			{
				target: 'maxHp',
				amount: `${data.hpBase} + ${data.hpPerLevel} * @actor.extraLevels`,
				type: 'class',
			},
			{
				target: 'surges-max',
				amount: data.healingSurgesBase,
				type: 'class',
			},
		];
	}

	static raceModifiers(data: RaceDataProperties): FeatureBonus[] {
		return [
			{
				target: 'speed',
				amount: data.baseSpeed,
				type: 'racial',
			},
		];
	}

	prepareDerivedData() {
		const allData = this.data;

		// all active effects and other linked objects should be loaded here
		if (allData._source.type !== allData.type) {
			// seriously, wtf?
			console.error('Got two different item types:', allData._source.type, allData.type);
			return;
		}
		if (allData._source.type === 'class' && allData.type === 'class') {
			this._prepareClassData(allData);
		}
		if (allData._source.type === 'race' && allData.type === 'race') {
			this._prepareRaceData(allData);
		}
	}

	private _prepareClassData(data: SpecificItemData<'class'>) {
		// console.log({ data });
		return data;
	}

	private _prepareRaceData(data: SpecificItemData<'race'>) {
		// console.log({ data });
		return data;
	}
}

export type SpecificItem<T extends PossibleItemData['type'] = PossibleItemData['type']> = MashupItem & {
	data: SpecificItemData<T>;
};
