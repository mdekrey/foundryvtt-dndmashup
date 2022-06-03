import classNames from 'classnames';
import { Bonuses, targets, conditions } from 'src/module/bonuses';
import { MashupItemBase } from 'src/module/item/mashup-item';
import { SpecificActor } from '../mashup-actor';

export function Effects({ actor }: { actor: SpecificActor }) {
	const bonusList = actor.specialBonuses;
	return (
		<>
			<Bonuses document={actor} field="data.bonuses" />
			<table>
				<thead className="bg-theme text-white">
					<tr>
						<th>Bonus</th>
						<th>Source</th>
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
								{bonus.amount} {bonus.type} bonus to {targets[bonus.target].label}{' '}
								{conditions[bonus.condition ?? ''].display}
								{/* TODO - better display */}
							</td>
							<td>
								<button type="button" className="w-full text-left" onClick={() => edit(bonus.context.item)}>
									{bonus.context.item.img ? (
										<img src={bonus.context.item.img} alt="" className="w-8 h-8 inline-block mr-2" />
									) : null}
									{bonus.context.item.name}
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
		</>
	);

	function edit(item: MashupItemBase) {
		item.sheet?.render(true, { focus: true });
	}
}
