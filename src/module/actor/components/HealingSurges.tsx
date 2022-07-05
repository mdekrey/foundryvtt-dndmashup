import { FormInput } from 'src/components/form-input';
import { SpecificActor } from '../mashup-actor';
import { SourceDataOf } from 'src/core/foundry';
import { Lens } from 'src/core/lens';
import { documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';

const baseLens = Lens.identity<SourceDataOf<SpecificActor>>();
const healthLens = baseLens.toField('data').toField('health');

export function HealingSurges({ actor }: { actor: SpecificActor }) {
	const documentState = documentAsState(actor);
	return (
		<>
			<h2 className="text-lg">Healing Surges</h2>
			<div>
				<span>Value: {actor.data.data.health.surges.value}</span>
				{' / '}
				<FormInput.Inline>
					<FormInput.Checkbox {...healthLens.toField('secondWindUsed').apply(documentState)} />
					<span className="whitespace-nowrap">Second Wind Used</span>
				</FormInput.Inline>
			</div>
			<div className="flex justify-start items-center gap-1 flex-grow">
				<FormInput className="w-16 inline-block">
					<FormInput.NumberField
						{...healthLens.toField('surges').toField('remaining').apply(documentState)}
						className="text-lg text-center"
					/>
					<FormInput.Label>Remaining</FormInput.Label>
				</FormInput>
				<span className="text-lg pb-4">/ {actor.data.data.health.surges.max}</span>
			</div>
		</>
	);
}
