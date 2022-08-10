import classNames from 'classnames';
import { RollJson } from '@foundryvtt-dndmashup/foundry-compat';
import { AttackRollResult } from './types';

export function RollInfo({ roll, rollResult }: { roll: RollJson; rollResult?: AttackRollResult }) {
	return (
		<div className="dice-result">
			<div className="dice-formula border border-gray-300">{roll.formula}</div>

			<div className="dice-tooltip">
				{[...roll.dice, ...roll.terms]
					.filter(
						(
							term
						): term is {
							class: 'Die';
							formula: string;
							faces: number;
							number: number;
							results: { result: number; active: boolean }[];
						} => term.class === 'Die'
					)
					.map((term, index) => (
						<section className="tooltip-part" key={index}>
							<div className="dice">
								<header className="part-header flexrow border-b-2 border-gray-300">
									<span className="part-formula font-bold">
										{term.number}d{term.faces}
									</span>

									<span className="part-total">
										{term.results.filter(({ active }) => active).reduce((a, b) => a + b.result, 0)}
									</span>
								</header>
								{term.results ? (
									<ol className="dice-rolls my-2">
										{term.results.map((result, index) => (
											<li
												key={index}
												className={classNames(`roll die d${term.faces}`, {
													min: result.result === 1,
													max: result.result === term.faces,
												})}>
												{result.result}
											</li>
										))}
									</ol>
								) : null}
							</div>
						</section>
					))}
			</div>
			<h4
				className={classNames('dice-total border border-gray-300', 'font-bold text-lg', {
					'text-green-dark': rollResult === 'critical-hit' || rollResult === 'maybe-critical-hit',
					'text-red-dark': rollResult === 'critical-miss',
				})}>
				{roll.total}
			</h4>
		</div>
	);
}
