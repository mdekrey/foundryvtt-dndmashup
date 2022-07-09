import { FormInput } from 'src/components/form-input';
import { documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';
import { SourceDataOf } from 'src/core/foundry';
import { Lens } from 'src/core/lens';
import { SpecificActor } from '../mashup-actor';

const lens = Lens.identity<SourceDataOf<SpecificActor>>().toField('data').toField('details').toField('biography');

export function Details({ actor }: { actor: SpecificActor }) {
	const documentState = documentAsState(actor);

	return (
		<>
			<FormInput.RichText {...lens.apply(documentState)} isEditor={actor.isOwner} rollData={actor.getRollData()} />
		</>
	);
}
