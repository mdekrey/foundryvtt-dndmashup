import { FormInput } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/mashup-core';

const textLens = Lens.identity<{ text: string }>().toField('text').default('');

export function Description({ isEditor, ...descriptionState }: { isEditor: boolean } & Stateful<{ text: string }>) {
	return (
		<>
			<FormInput.RichText {...textLens.apply(descriptionState)} isEditor={isEditor} />
		</>
	);
}
