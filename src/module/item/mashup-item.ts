import { PossibleItemData, SpecificItemData } from './types';

export class MashupItem extends Item {
	data!: PossibleItemData;

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
	}

	private _prepareRaceData(data: SpecificItemData<'race'>) {
		// console.log({ data });
	}
}

export type SpecificItem<T extends PossibleItemData['type'] = PossibleItemData['type']> = MashupItem & {
	data: SpecificItemData<T>;
};
