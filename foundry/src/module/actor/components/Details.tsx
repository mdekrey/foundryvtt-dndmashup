import { FormInput } from 'src/components/form-input';
import { documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';
import { Lens } from 'dndmashup-react/core/lens';
import { SpecificActor } from '../mashup-actor';
import { PossibleActorData } from '../types';

const lens = Lens.identity<PossibleActorData>().toField('data').toField('details').toField('biography');

export function Details({ actor }: { actor: SpecificActor }) {
	const documentState = documentAsState<PossibleActorData>(actor);

	return (
		<>
			<FormInput.RichText {...lens.apply(documentState)} isEditor={actor.isOwner} rollData={actor.getRollData()} />
		</>
	);
}
