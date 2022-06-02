import classNames from 'classnames';
import { Bonuses } from 'src/module/item/components/bonuses';
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
								{bonus.amount}
								{bonus.type}
								bonus to
								{bonus.target}
								{/* TODO - better display */}
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
}
