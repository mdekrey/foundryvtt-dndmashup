import { FormInput } from '@foundryvtt-dndmashup/components';
import { Stateful } from '@foundryvtt-dndmashup/core';

export function Details({ isEditor, ...documentState }: { isEditor: boolean } & Stateful<string>) {
	return (
		<>
			<FormInput.RichText {...documentState} isEditor={isEditor} />
		</>
	);
}
