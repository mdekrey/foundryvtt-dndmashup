import { FormInput } from '@foundryvtt-dndmashup/components';
import { ActionPoints } from '../types';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { ResourceLayout } from './ResourceLayout';

const actionPointsLens = Lens.identity<ActionPoints>();

export function ActionPoints({ actionPointsState }: { actionPointsState: Stateful<ActionPoints> }) {
	return (
		<ResourceLayout
			title="Action Points"
			body={
				<FormInput className="w-16">
					<FormInput.NumberField
						{...actionPointsLens.toField('value').apply(actionPointsState)}
						className="text-center"
					/>
					<FormInput.Label>Current</FormInput.Label>
				</FormInput>
			}
			footer={
				<FormInput.Inline>
					<FormInput.Checkbox {...actionPointsLens.toField('usedThisEncounter').apply(actionPointsState)} />
					Used
				</FormInput.Inline>
			}
		/>
	);
}
