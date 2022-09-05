import classNames from 'classnames';
import {
	FeatureBonusWithSource,
	getRuleText,
	DynamicListEntryWithSource,
	dynamicListTargetNames,
	bonusToText,
	FullTriggeredEffect,
	getTriggerText,
} from '@foundryvtt-dndmashup/mashup-rules';
import { sortBy } from 'lodash/fp';
import { SourceButton } from './SourceButton';
import { toText } from '../../../effects';

export function Effects({
	bonusList,
	triggeredEffects,
	dynamicList,
}: {
	bonusList: FeatureBonusWithSource[];
	triggeredEffects: FullTriggeredEffect[];
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
						return (
							<tr
								key={idx}
								className={classNames(
									'even:bg-gradient-to-r from-transparent to-white odd:bg-transparent',
									'border-b-2 border-transparent',
									{ 'opacity-75': bonus.disabled }
								)}>
								<td className="px-1">{bonusToText(bonus)}</td>
								<td>{bonus.source ? <SourceButton source={bonus.source} /> : null}</td>
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
								<td>{entry.source ? <SourceButton source={entry.source} /> : null}</td>
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
						<th>Triggered Effect</th>
						<th>Source</th>
					</tr>
				</thead>
				<tbody>
					{sortBy((l) => [l.trigger.trigger], triggeredEffects).map((entry, idx) => {
						const trigger = entry.trigger;
						const triggerText = getTriggerText(trigger);
						const condition = entry.condition;
						const conditionText = condition ? getRuleText(condition) : null;

						return (
							<tr
								key={idx}
								className={classNames(
									'even:bg-gradient-to-r from-transparent to-white odd:bg-transparent',
									'border-b-2 border-transparent'
								)}>
								<td className="px-1">
									{triggerText}
									{conditionText ? ` ` : ''}
									{conditionText}: {toText(entry.effect)}
								</td>
								<td>
									{entry.sources.map((source, index) => (
										<SourceButton source={source} key={source.id ?? index} />
									))}
								</td>
							</tr>
						);
					})}
					{triggeredEffects.length === 0 ? (
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
