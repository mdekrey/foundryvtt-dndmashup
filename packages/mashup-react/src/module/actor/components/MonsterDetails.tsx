import { FormInput } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { abilities, DynamicListEntry } from '@foundryvtt-dndmashup/mashup-rules';
import capitalize from 'lodash/fp/capitalize';
import { MonsterSystemData } from '../types';

const base = Lens.fromProp<MonsterSystemData>();
const abilitiesLens = base('abilities');

function getLanguages(data: MonsterSystemData) {
	return (data.dynamicList ?? [])
		.filter((e) => e.target === 'languagesKnown')
		.map((e) => capitalize(e.entry))
		.join(', ');
}

const LanguagesLens = Lens.from<MonsterSystemData, string>(getLanguages, (mutator) => (draft) => {
	const languages = mutator(getLanguages(draft));
	draft.dynamicList = [
		...(draft.dynamicList ?? []).filter((e) => e.target !== 'languagesKnown'),
		...languages
			.split(',')
			.map((k) => k.toLowerCase().trim())
			.filter((v) => v.length > 0)
			.map((entry): DynamicListEntry => ({ target: 'languagesKnown', entry, condition: null })),
	];
});

export function MonsterDetails({ documentState }: { documentState: Stateful<MonsterSystemData> }) {
	return (
		<div className="grid grid-cols-12 grid-rows-2 gap-x-1">
			<FormInput className="col-span-12">
				<FormInput.TextField {...LanguagesLens.apply(documentState)} />
				<FormInput.Label>Languages</FormInput.Label>
			</FormInput>

			{abilities.map((ability) => (
				<FormInput className="col-span-2" key={ability}>
					<FormInput.NumberField {...abilitiesLens.toField(ability).toField('base').apply(documentState)} />
					<FormInput.Label>{ability.toUpperCase()}</FormInput.Label>
				</FormInput>
			))}
		</div>
	);
}
