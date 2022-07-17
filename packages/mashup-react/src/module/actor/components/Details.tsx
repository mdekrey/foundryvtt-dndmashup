import { FormInput } from 'src/components/form-input';
import { Stateful } from 'src/core/lens';

export function Details({ isEditor, ...documentState }: { isEditor: boolean } & Stateful<string>) {
	return (
		<>
			<FormInput.RichText {...documentState} isEditor={isEditor} />
		</>
	);
}
