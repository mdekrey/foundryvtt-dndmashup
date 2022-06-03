import classNames from 'classnames';
import produce from 'immer';
import { FormInput } from 'src/components/form-input';
import { useSetField } from 'src/components/form-input/hooks/useSetField';
import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { PathName, getFieldValue } from 'src/core/path-typings';
import { FeatureBonus } from './types';
import { BonusTarget, ConditionRule } from './constants';
import { targets, conditions } from './bonus-sheet-utils';

const selectTargets = Object.entries(targets).map(([key, { label }]) => ({ key, value: key as BonusTarget, label }));
const selectConditions = Object.entries(conditions).map(([key, { label }]) => ({
	key,
	value: key === '' ? undefined : (key as ConditionRule),
	label,
}));

export function Bonuses<TDocument extends AnyDocument>({
	document,
	field,
	className,
}: {
	document: TDocument;
	field: PathName<SourceDataOf<TDocument>, FeatureBonus[]>;
	className?: string;
}) {
	const bonusList = getFieldValue(document.data._source, field);
	const setter = useSetField(document, field);

	function onAdd() {
		setter([
			...bonusList,
			{
				amount: '0',
				target: 'defense-ac',
				...(bonusList[bonusList.length - 1] as Partial<FeatureBonus>),
			},
		]);
	}

	function onEnable(index: number) {
		return () =>
			setter(
				produce<typeof bonusList>((draft) => {
					draft[index].disabled = false;
				})(bonusList)
			);
	}

	function onDisable(index: number) {
		return () =>
			setter(
				produce<typeof bonusList>((draft) => {
					draft[index].disabled = true;
				})(bonusList)
			);
	}

	function onDelete(index: number) {
		return () => {
			return setter([...bonusList.slice(0, index), ...bonusList.slice(index + 1)], { deleteData: true });
		};
	}

	return (
		<div className={className}>
			<table className="w-full border-collapse">
				<thead className="bg-theme text-white">
					<tr>
						<th>Amount</th>
						<th>Type</th>
						<th></th>
						<th>Target</th>
						<th>Condition</th>
						<th>
							<button type="button" onClick={onAdd}>
								<i className="fa fa-plus"></i> Add
							</button>
						</th>
					</tr>
				</thead>
				<tbody>
					{bonusList.map((bonus, idx) => (
						<tr
							key={idx}
							className={classNames(
								'even:bg-gradient-to-r from-transparent to-white odd:bg-transparent',
								'border-b-2 border-transparent',
								{ 'opacity-75': bonus.disabled }
							)}>
							<td className="px-1">
								<FormInput.AutoTextField
									document={document}
									field={`${field}.${idx}.amount` as never}
									className="text-sm text-center"
								/>
							</td>
							<td className="px-1">
								<FormInput.AutoTextField
									document={document}
									field={`${field}.${idx}.type` as never}
									className="text-sm text-center"
								/>
							</td>
							<td className="px-1 whitespace-nowrap">bonus to</td>
							<td className="px-1">
								<FormInput.AutoSelect
									document={document}
									field={`${field}.${idx}.target` as never}
									options={selectTargets}
									className="text-sm text-center"
								/>
							</td>
							<td className="px-1">
								<FormInput.AutoSelect
									document={document}
									field={`${field}.${idx}.condition` as never}
									options={selectConditions}
									className="text-sm text-center"
								/>
							</td>
							<td className="text-right px-1 whitespace-nowrap">
								{bonus.disabled ? (
									<button type="button" title="Click to Enable" className="focusable" onClick={onEnable(idx)}>
										<i className="far fa-circle"></i>
									</button>
								) : (
									<button type="button" title="Click to Disable" className="focusable" onClick={onDisable(idx)}>
										<i className="far fa-check-circle"></i>
									</button>
								)}
								<button type="button" title="Click to Delete" className="focusable" onClick={onDelete(idx)}>
									<i className="fas fa-trash"></i>
								</button>
							</td>
						</tr>
					))}
					{bonusList.length === 0 ? (
						<tr
							className={classNames(
								'even:bg-gradient-to-r from-transparent to-white odd:bg-transparent',
								'border-b-2 border-transparent'
							)}>
							<td className="text-center" colSpan={6}>
								No bonuses
							</td>
						</tr>
					) : null}
				</tbody>
			</table>
		</div>
	);
}
