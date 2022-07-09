import { FormInput } from 'src/components/form-input';
import { Stateful } from 'src/components/form-input/hooks/useDocumentAsState';
import { Lens } from 'src/core/lens';

const textLens = Lens.identity<{ text: string }>().toField('text').default('');

export function Description({ isEditor, ...descriptionState }: { isEditor: boolean } & Stateful<{ text: string }>) {
	return (
		<>
			<FormInput.RichText {...textLens.apply(descriptionState)} isEditor={isEditor} />
		</>
	);
}
