import { FormInput } from 'src/components/form-input';
import { SpecificActor } from '../mashup-actor';
import { SourceDataOf } from 'src/core/foundry';
import { Lens } from 'src/core/lens';
import { documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';

const baseLens = Lens.identity<SourceDataOf<SpecificActor>>();
const abilitiesLens = baseLens.toField('data').toField('actionPoints');

export function ActionPoints({ actor }: { actor: SpecificActor }) {
	const documentState = documentAsState(actor);
	return (
		<>
			<h2 className="text-lg">Action Points</h2>
			<FormInput className="w-16 flex flex-col items-center">
				<FormInput.NumberField
					{...abilitiesLens.toField('value').apply(documentState)}
					className="text-lg text-center"
				/>
				<FormInput.Label>Current</FormInput.Label>
			</FormInput>
			<FormInput.Inline className="mt-2">
				<FormInput.Checkbox {...abilitiesLens.toField('usedThisEncounter').apply(documentState)} />
				Used
			</FormInput.Inline>
		</>
	);
}
