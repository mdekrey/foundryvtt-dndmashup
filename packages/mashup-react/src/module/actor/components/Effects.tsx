import classNames from 'classnames';
import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { ensureSign } from '@foundryvtt-dndmashup/core';
import {
	numericBonusTargetNames,
	FeatureBonusWithSource,
	getRuleText,
	DynamicListEntryWithSource,
	dynamicListTargetNames,
} from '@foundryvtt-dndmashup/mashup-rules';
import { sortBy } from 'lodash/fp';

export function Effects({
	bonusList,
	dynamicList,
}: {
	bonusList: FeatureBonusWithSource[];
	dynamicList: DynamicListEntryWithSource[];
}) {
	return (
		<>
			<table>
				<thead className="bg-theme text-white">
					<tr>
						<th>Bonus</th>
						<th>Source</th>
					</tr>
				</thead>
				<tbody>
					{bonusList.map((bonus, idx) => {
						const condition = bonus.condition;
						const conditionText = condition ? getRuleText(condition) : null;
						return (
							<tr
								key={idx}
								className={classNames(
									'even:bg-gradient-to-r from-transparent to-white odd:bg-transparent',
									'border-b-2 border-transparent',
									{ 'opacity-75': bonus.disabled }
								)}>
								<td className="px-1">
									{ensureSign(bonus.amount)} {bonus.type} bonus to {numericBonusTargetNames[bonus.target].label}{' '}
									{conditionText ? `when ${conditionText}` : null}
								</td>
								<td>
									{bonus.source ? (
										<button
											type="button"
											className="w-full text-left"
											onClick={() => bonus.source && edit(bonus.source)}>
											{bonus.source.img ? (
												<img src={bonus.source.img} alt="" className="w-8 h-8 inline-block mr-2" />
											) : null}
											{bonus.source.name}
										</button>
									) : null}
								</td>
							</tr>
						);
					})}
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

			<table>
				<thead className="bg-theme text-white">
					<tr>
						<th>List Entry</th>
						<th>Source</th>
					</tr>
				</thead>
				<tbody>
					{sortBy((l) => [l.target, l.entry], dynamicList).map((entry, idx) => {
						const condition = entry.condition;
						const conditionText = condition ? getRuleText(condition) : null;
						return (
							<tr
								key={idx}
								className={classNames(
									'even:bg-gradient-to-r from-transparent to-white odd:bg-transparent',
									'border-b-2 border-transparent',
									{ 'opacity-75': entry.disabled }
								)}>
								<td className="px-1">
									{dynamicListTargetNames[entry.target].label}: {entry.entry} {conditionText}
								</td>
								<td>
									{entry.source ? (
										<button
											type="button"
											className="w-full text-left"
											onClick={() => entry.source && edit(entry.source)}>
											{entry.source.img ? (
												<img src={entry.source.img} alt="" className="w-8 h-8 inline-block mr-2" />
											) : null}
											{entry.source.name}
										</button>
									) : null}
								</td>
							</tr>
						);
					})}
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
		</>
	);

	function edit(item: SimpleDocument) {
		item.showEditDialog();
	}
}
