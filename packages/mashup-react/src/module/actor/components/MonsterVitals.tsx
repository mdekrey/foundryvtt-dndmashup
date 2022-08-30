import { FormInput } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { defenses, DynamicListEntry } from '@foundryvtt-dndmashup/mashup-rules';
import capitalize from 'lodash/fp/capitalize';
import { ActorDerivedData } from '../derivedDataType';
import { MonsterDataSourceData } from '../types';

const base = Lens.fromProp<MonsterDataSourceData>();
const initiativeLens = base('initiativeBase');
const speedLens = base('speedBase');
const healthLens = base('health');
const defensesLens = base('baseDefenses').default({ ac: 10, fort: 10, refl: 10, will: 10 });

function getSenses(data: MonsterDataSourceData) {
	return (data.dynamicList ?? [])
		.filter((e) => e.target === 'senses')
		.map((e) => capitalize(e.entry))
		.join(', ');
}

const sensesLens = Lens.from<MonsterDataSourceData, string>(getSenses, (mutator) => (draft) => {
	const senses = mutator(getSenses(draft));
	draft.dynamicList = [
		...(draft.dynamicList ?? []).filter((e) => e.target !== 'senses'),
		...senses
			.split(',')
			.map((k) => k.toLowerCase().trim())
			.filter((v) => v.length > 0)
			.map((entry): DynamicListEntry => ({ target: 'senses', entry, condition: null })),
	];
});

export function MonsterVitals({
	documentState,
	derivedData,
}: {
	documentState: Stateful<MonsterDataSourceData>;
	derivedData: ActorDerivedData;
}) {
	return (
		<div className="grid grid-cols-12 grid-rows-2 gap-x-1">
			<FormInput className="col-span-2">
				<FormInput.NumberField {...initiativeLens.apply(documentState)} />
				<FormInput.Label>Initiative</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-10">
				<FormInput.TextField {...sensesLens.apply(documentState)} />
				<FormInput.Label>Senses</FormInput.Label>
			</FormInput>

			<div className="col-span-4 flex">
				<FormInput className="flex-grow">
					<FormInput.NumberField
						{...healthLens.toField('hp').toField('value').apply(documentState)}
						className="text-center"
					/>
					<FormInput.Label>Current</FormInput.Label>
				</FormInput>
				<span className="text-lg pb-4">/</span>

				<FormInput className="flex-grow">
					<FormInput.NumberField
						{...healthLens.toField('hp').toField('maxBase').apply(documentState)}
						className="text-center"
					/>
					<FormInput.Label>Max</FormInput.Label>
				</FormInput>
			</div>
			<div className="col-span-8">
				{documentState.value.details.power === 'minion' ? '; a missed attack never damages a minion.' : ''}
			</div>

			{defenses.map((defense) => (
				<FormInput className="col-span-3" key={defense}>
					<FormInput.NumberField {...defensesLens.toField(defense).apply(documentState)} />
					<FormInput.Label>{defense.toUpperCase()}</FormInput.Label>
				</FormInput>
			))}

			<FormInput className="col-span-3">
				<FormInput.NumberField {...speedLens.apply(documentState)} />
				<FormInput.Label>Speed</FormInput.Label>
			</FormInput>
		</div>
	);
}
