import { FormInput } from 'src/components/form-input';
import { Lens, Stateful } from 'dndmashup-react/core/lens';

const textLens = Lens.identity<{ text: string }>().toField('text').default('');

export function Description({ isEditor, ...descriptionState }: { isEditor: boolean } & Stateful<{ text: string }>) {
	return (
		<>
			<FormInput.RichText {...textLens.apply(descriptionState)} isEditor={isEditor} />
		</>
	);
}
