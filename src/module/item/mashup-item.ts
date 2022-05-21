import { ClassDataSourceData, RaceDataSourceData } from 'src/template.types';
import { ClassDataProperties, PossibleItemData, RaceDataProperties, SpecificItemData } from './types';

export class MashupItem extends Item {
	data!: PossibleItemData;

	prepareDerivedData() {
		const allData = this.data;

		// all active effects and other linked objects should be loaded here
		console.log({
			id: this.id,
			effects: this.effects,
			type: allData._source.type,
			source: allData._source.data,
			data: allData.data,
		});

		if (allData._source.type !== allData.type) {
			// seriously, wtf?
			console.error('Got two different item types:', allData._source.type, allData.type);
			return;
		}
		if (allData._source.type === 'class' && allData.type === 'class') {
			this._prepareClassData(allData._source.data, allData.data);
		}
		if (allData._source.type === 'race' && allData.type === 'race') {
			this._prepareRaceData(allData._source.data, allData.data);
		}
	}

	private _prepareClassData(source: Readonly<ClassDataSourceData>, data: ClassDataProperties) {
		console.log({ source, data });
	}

	private _prepareRaceData(source: Readonly<RaceDataSourceData>, data: RaceDataProperties) {
		console.log({ source, data });
	}
}

export type SpecificItem<T extends PossibleItemData['type'] = PossibleItemData['type']> = MashupItem & {
	data: SpecificItemData<T>;
};
