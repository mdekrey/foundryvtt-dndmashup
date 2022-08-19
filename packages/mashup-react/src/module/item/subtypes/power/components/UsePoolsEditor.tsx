import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { FormInput } from '@foundryvtt-dndmashup/components';

const keywordsLens = Lens.from<string[], string>(
	(input) => input.join(', '),
	(mutator) => (draft) => {
		return mutator(draft.join(', '))
			.split(',')
			.map((k) => k.trim())
			.filter((v) => v.length > 0);
	}
);

export function UsePoolsEditor({ pools }: { pools: Stateful<string[]> }) {
	return (
		<div className="grid grid-cols-1 mt-1">
			<FormInput className="col-span-6 self-end text-lg">
				<FormInput.TextField {...keywordsLens.apply(pools)} />
				<FormInput.Label>Used Pools</FormInput.Label>
			</FormInput>
		</div>
	);
}
