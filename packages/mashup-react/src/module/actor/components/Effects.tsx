import classNames from 'classnames';
import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { Lens, Stateful } from '@foundryvtt-dndmashup/mashup-core';
import { Bonuses, targets, conditionsRegistry, FeatureBonusWithContext, ConditionRuleType } from '../../bonuses';
import { ActorDataSource } from '../types';

const dataLens = Lens.identity<ActorDataSource['data']>(); // baseLens.toField('data');
const bonusesLens = dataLens.toField('bonuses');

export function Effects({
	bonusList,
	...documentState
}: Stateful<ActorDataSource['data']> & { bonusList: FeatureBonusWithContext[] }) {
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
						const rule =
							typeof bonus.condition === 'string'
								? bonus.condition === ''
									? null
									: (bonus.condition as ConditionRuleType)
								: bonus.condition?.rule;
						return (
							<tr
								key={idx}
								className={classNames(
									'even:bg-gradient-to-r from-transparent to-white odd:bg-transparent',
									'border-b-2 border-transparent',
									{ 'opacity-75': bonus.disabled }
								)}>
								<td className="px-1">
									{bonus.amount} {bonus.type} bonus to {targets[bonus.target].label}{' '}
									{rule ? conditionsRegistry[rule].display : null}
									{/* TODO - better display */}
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
		</>
	);

	function edit(item: SimpleDocument) {
		item.showEditDialog();
	}
}
