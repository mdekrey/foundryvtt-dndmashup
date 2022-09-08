import { keywordsAsStringLens, Stateful } from '@foundryvtt-dndmashup/core';
import { FormInput } from '@foundryvtt-dndmashup/components';

export function UsePoolsEditor({ pools }: { pools: Stateful<string[]> }) {
	return (
		<div className="grid grid-cols-1 mt-1">
			<FormInput className="col-span-6 self-end text-lg">
				<FormInput.TextField {...keywordsAsStringLens.apply(pools)} />
				<FormInput.Label>Used Pools</FormInput.Label>
			</FormInput>
		</div>
	);
}
