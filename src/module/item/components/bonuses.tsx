import classNames from 'classnames';
import produce from 'immer';
import { FormInput } from 'src/components/form-input';
import { SelectItem } from 'src/components/form-input/auto-select';
import { useSetField } from 'src/components/form-input/hooks/useSetField';
import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { PathName, getFieldValue } from 'src/core/path-typings';
import { BonusTarget, ConditionRule, FeatureBonus } from 'src/module/bonuses';

export const targets: SelectItem<BonusTarget>[] = [
	{ value: 'ability-str', key: 'ability-str', label: 'STR' },
	{ value: 'ability-con', key: 'ability-con', label: 'CON' },
	{ value: 'ability-dex', key: 'ability-dex', label: 'DEX' },
	{ value: 'ability-int', key: 'ability-int', label: 'INT' },
	{ value: 'ability-wis', key: 'ability-wis', label: 'WIS' },
	{ value: 'ability-cha', key: 'ability-cha', label: 'CHA' },
	{ value: 'defense-ac', key: 'defense-ac', label: 'AC' },
	{ value: 'defense-fort', key: 'defense-fort', label: 'FORT' },
	{ value: 'defense-refl', key: 'defense-refl', label: 'REFL' },
	{ value: 'defense-will', key: 'defense-will', label: 'WILL' },
	{ value: 'surges-max', key: 'surges-max', label: 'Surges per Day' },
	{ value: 'surges-value', key: 'surges-value', label: 'HP per Surge' },
	{ value: 'maxHp', key: 'maxHp', label: 'Maximum HP' },
	{ value: 'speed', key: 'speed', label: 'Speed' },
];

export const conditions: SelectItem<ConditionRule | ''>[] = [
	{ value: '', key: '', label: '(always)' },
	{ value: 'proficientIn', key: 'proficientIn', label: 'When you are proficient with the item' },
	{ value: 'bloodied', key: 'bloodied', label: 'When you are bloodied' },
];

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
		<div className={classNames('w-full h-full', className)}>
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
									options={targets}
									className="text-sm text-center"
								/>
							</td>
							<td className="px-1">
								<FormInput.AutoSelect
									document={document}
									field={`${field}.${idx}.condition` as never}
									options={conditions}
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
				</tbody>
			</table>
		</div>
	);
}
