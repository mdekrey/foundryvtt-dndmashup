import classNames from 'classnames';
import { TriggeredEffect } from './types';
import { IconButton } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { useApplicationDispatcher } from '@foundryvtt-dndmashup/foundry-compat';
import { ConditionSelector } from '../conditions';
import { InstantaneousEffectFields } from './instantaneous-effect-fields';
import { TriggerSelector } from '../triggers/TriggerSelector';

const baseLens = Lens.identity<TriggeredEffect[]>().default([]);

const conditionRuleLens = Lens.fromProp<TriggeredEffect>()('condition');

export function TriggeredEffectsEditor({
	triggeredEffects,
	className,
}: {
	triggeredEffects: Stateful<TriggeredEffect[]>;
	className?: string;
}) {
	const apps = useApplicationDispatcher();

	function onAdd() {
		baseLens.apply(triggeredEffects).onChangeValue((draft) => {
			draft.push({
				condition: null,
				effect: {
					damage: null,
					healing: null,
					activeEffectTemplate: null,
					text: '',
				},
				trigger: {
					trigger: 'startOfTurn',
					parameter: null,
				},
			});
		});
	}

	function onDelete(index: number) {
		return async () => {
			const result = await apps
				.launchApplication('dialog', {
					title: 'Are you sure...?',
					content: `Are you sure you want to delete this bonus? This cannot be undone.`,
				})
				.then(({ result }) => result)
				.catch(() => false);
			if (result)
				return triggeredEffects.onChangeValue((draft) => {
					draft.splice(index, 1);
				});
		};
	}

	return (
		<div className={className}>
			<table className="w-full border-collapse">
				<thead className="bg-theme text-white">
					<tr>
						<th>Trigger</th>
						<th>Condition</th>
						<th>Effect</th>
						<th>
							<IconButton iconClassName="fa fa-plus" text="Add" onClick={onAdd} />
						</th>
					</tr>
				</thead>
				<tbody>
					{triggeredEffects.value?.map((trigger, idx) => (
						<tr
							key={idx}
							className={classNames(
								'even:bg-gradient-to-r from-transparent to-white odd:bg-transparent',
								'text-sm',
								'h-10'
							)}>
							<td className="px-1">
								<TriggerSelector {...baseLens.toField(idx).toField('trigger').apply(triggeredEffects)} />
							</td>
							<td className="px-1">
								<ConditionSelector {...baseLens.toField(idx).combine(conditionRuleLens).apply(triggeredEffects)} />
							</td>
							<td className="px-1">
								<InstantaneousEffectFields {...baseLens.toField(idx).toField('effect').apply(triggeredEffects)} />
							</td>
							<td className="text-right px-1 whitespace-nowrap">
								<IconButton iconClassName="fas fa-trash" title="Click to Delete" onClick={onDelete(idx)} />
							</td>
						</tr>
					))}
					{(triggeredEffects.value?.length ?? 0) === 0 ? (
						<tr
							className={classNames(
								'even:bg-gradient-to-r from-transparent to-white odd:bg-transparent',
								'border-b-2 border-transparent'
							)}>
							<td className="text-center" colSpan={6}>
								No Triggered Effects
							</td>
						</tr>
					) : null}
				</tbody>
			</table>
		</div>
	);
}
