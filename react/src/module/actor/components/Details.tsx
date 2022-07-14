import { FormInput } from 'src/components/form-input';
import { Lens, Stateful } from 'src/core/lens';
import { ActorDataSource } from '../types';

const lens = Lens.identity<ActorDataSource>().toField('data').toField('details').toField('biography');

export function Details({ isEditor, ...documentState }: { isEditor: boolean } & Stateful<ActorDataSource>) {
	return (
		<>
			<FormInput.RichText {...lens.apply(documentState)} isEditor={isEditor} />
		</>
	);
}
