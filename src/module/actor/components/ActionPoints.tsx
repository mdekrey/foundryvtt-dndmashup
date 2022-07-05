import { FormInput } from 'src/components/form-input';
import { ActionPoints } from '../types';
import { Lens } from 'src/core/lens';
import { Stateful } from 'src/components/form-input/hooks/useDocumentAsState';

const actionPointsLens = Lens.identity<ActionPoints>();

export function ActionPoints({ actionPointsState }: { actionPointsState: Stateful<ActionPoints> }) {
	return (
		<>
			<h2 className="text-lg">Action Points</h2>
			<FormInput className="w-16 flex flex-col items-center">
				<FormInput.NumberField
					{...actionPointsLens.toField('value').apply(actionPointsState)}
					className="text-lg text-center"
				/>
				<FormInput.Label>Current</FormInput.Label>
			</FormInput>
			<FormInput.Inline className="mt-2">
				<FormInput.Checkbox {...actionPointsLens.toField('usedThisEncounter').apply(actionPointsState)} />
				Used
			</FormInput.Inline>
		</>
	);
}
