import { FormInput } from 'src/components/form-input';
import { SpecificActor } from '../mashup-actor';
import { SourceDataOf } from 'src/core/foundry';
import { Lens } from 'src/core/lens';
import { documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';

const baseLens = Lens.identity<SourceDataOf<SpecificActor>>();
const healthLens = baseLens.toField('data').toField('health');

export function HitPoints({ actor }: { actor: SpecificActor }) {
	const documentState = documentAsState(actor);
	return (
		<>
			<h2 className="text-lg">Hit Points</h2>
			<div className="flex justify-start items-center gap-1 text-lg">
				<FormInput className="w-16">
					<FormInput.NumberField {...healthLens.toField('currentHp').apply(documentState)} className="text-center" />
					<FormInput.Label>Current</FormInput.Label>
				</FormInput>
				<span className="text-lg pb-4">/ {actor.data.data.health.maxHp}</span>
			</div>
			<label>
				Temp HP
				<div className="inline-block w-16 pl-2">
					<FormInput.NumberField {...healthLens.toField('temporaryHp').apply(documentState)} className="text-center" />
				</div>
			</label>
		</>
	);
}
