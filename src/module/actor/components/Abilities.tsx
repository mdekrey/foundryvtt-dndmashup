import { Fragment } from 'react';
import { FormInput } from 'src/components/form-input';
import { Abilities as abilities } from 'src/types/types';
import { SpecificActor } from '../mashup-actor';
import { SourceDataOf } from 'src/core/foundry';
import { Lens } from 'src/core/lens';
import { documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';

const baseLens = Lens.identity<SourceDataOf<SpecificActor>>();
const abilitiesLens = baseLens.toField('data').toField('abilities');

export function Abilities({ actor }: { actor: SpecificActor }) {
	const documentState = documentAsState(actor);
	return (
		<>
			<div className="grid grid-cols-3 gap-1 items-center justify-items-center w-32">
				<h2 className="text-lg col-span-3">Abilities</h2>
				{abilities.map((ability) => (
					<Fragment key={ability}>
						<FormInput.NumberField
							{...abilitiesLens.toField(ability).toField('base').apply(documentState)}
							className="w-8 text-lg text-center"
						/>
						<FormInput.Label className="uppercase font-bold link">{ability}</FormInput.Label>
						<span title="{{a}}">{ensureSign(actor.data.data.abilities[ability].final)}</span>
					</Fragment>
				))}
			</div>
		</>
	);
}

function ensureSign(mod: number) {
	const result = mod.toFixed(0);
	return result.startsWith('-') ? result : `+${result}`;
}
