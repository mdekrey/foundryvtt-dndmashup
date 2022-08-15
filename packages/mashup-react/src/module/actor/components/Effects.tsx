import classNames from 'classnames';
import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import {
	Bonuses,
	numericBonusTargetNames,
	FeatureBonusWithContext,
	getRuleText,
	DynamicList,
	DynamicListEntryWithContext,
	dynamicListTargetNames,
} from '@foundryvtt-dndmashup/mashup-rules';
import { ActorDataSource } from '../types';

const dataLens = Lens.identity<ActorDataSource['data']>(); // baseLens.toField('data');
const bonusesLens = dataLens.toField('bonuses');
const dynamicListLens = dataLens.toField('dynamicList');

export function Effects({
	bonusList,
	dynamicList,
	...documentState
}: Stateful<ActorDataSource['data']> & {
	bonusList: FeatureBonusWithContext[];
	dynamicList: DynamicListEntryWithContext[];
}) {
	return (
		<>
			<Bonuses bonuses={bonusesLens.apply(documentState)} />
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
									{bonus.amount} {bonus.type} bonus to {numericBonusTargetNames[bonus.target].label} {conditionText}
									{/* TODO - better editor that includes condition parameters */}
								</td>
								<td>
									{bonus.context.item ? (
										<button
											type="button"
											className="w-full text-left"
											onClick={() => bonus.context.item && edit(bonus.context.item)}>
											{bonus.context.item.img ? (
												<img src={bonus.context.item.img} alt="" className="w-8 h-8 inline-block mr-2" />
											) : null}
											{bonus.context.item.name}
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

			<DynamicList dynamicList={dynamicListLens.apply(documentState)} />
			<table>
				<thead className="bg-theme text-white">
					<tr>
						<th>Bonus</th>
						<th>Source</th>
					</tr>
				</thead>
				<tbody>
					{dynamicList.map((entry, idx) => {
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
									{entry.context.item ? (
										<button
											type="button"
											className="w-full text-left"
											onClick={() => entry.context.item && edit(entry.context.item)}>
											{entry.context.item.img ? (
												<img src={entry.context.item.img} alt="" className="w-8 h-8 inline-block mr-2" />
											) : null}
											{entry.context.item.name}
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
