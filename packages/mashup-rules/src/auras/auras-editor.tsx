import classNames from 'classnames';
import { BlockHeader, FormInput } from '@foundryvtt-dndmashup/components';
import { Aura } from './types';
import { IconButton } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { useApplicationDispatcher } from '@foundryvtt-dndmashup/foundry-compat';
import { BonusesEditor } from '../bonuses';
import { ConditionSelector } from '../conditions/ConditionSelector';
import { TriggeredEffectsEditor } from '../effects/TriggeredEffectsEditor';

const baseLens = Lens.identity<Aura[]>();

const rangeLens = Lens.fromProp<Aura>()('range');
const bonusesLens = Lens.fromProp<Aura>()('bonuses');
const triggeredEffectsLens = Lens.fromProp<Aura>()('triggeredEffects');
const conditionRuleLens = Lens.fromProp<Aura>()('condition');

export function AurasEditor({ auras, className }: { auras: Stateful<Aura[]>; className?: string }) {
	const apps = useApplicationDispatcher();

	function onAdd() {
		auras.onChangeValue((draft) => {
			draft.push({
				range: auras.value[auras.value.length - 1]?.range ?? 1,
				condition: null,
				bonuses: [],
				triggeredEffects: [],
			});
		});
	}

	function onDelete(index: number) {
		return async () => {
			const result = await apps
				.launchApplication('dialog', {
					title: 'Are you sure...?',
					content: `Are you sure you want to delete this aura? This cannot be undone.`,
				})
				.then(({ result }) => result)
				.catch(() => false);
			if (result)
				return auras.onChangeValue((draft) => {
					draft.splice(index, 1);
				});
		};
	}

	return (
		<div className={className}>
			<table className="w-full border-collapse">
				<thead className="bg-theme text-white">
					<tr>
						<th>Details</th>
						<th>
							<IconButton iconClassName="fa fa-plus" text="Add" onClick={onAdd} />
						</th>
					</tr>
				</thead>
				<tbody>
					{auras.value.map((bonus, idx) => (
						<tr
							key={idx}
							className={classNames(
								'even:bg-gradient-to-r from-transparent to-white odd:bg-transparent',
								'text-sm',
								'h-10'
							)}>
							<td className="px-8">
								<AuraDetails aura={baseLens.toField(idx).apply(auras)} />
							</td>
							<td className="text-right px-1 whitespace-nowrap">
								<IconButton iconClassName="fas fa-trash" title="Click to Delete" onClick={onDelete(idx)} />
							</td>
						</tr>
					))}
					{auras.value.length === 0 ? (
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

const auraLens = Lens.identity<Aura>();

function AuraDetails({ aura }: { aura: Stateful<Aura> }) {
	return (
		<div className="flex flex-col">
			<FormInput>
				<FormInput.NumberField {...auraLens.combine(rangeLens).apply(aura)} className="text-center" />
				<FormInput.Label>Range</FormInput.Label>
			</FormInput>

			<FormInput>
				<ConditionSelector {...auraLens.combine(conditionRuleLens).apply(aura)} />
				<FormInput.Label>Condition</FormInput.Label>
			</FormInput>

			<BlockHeader>Bonuses</BlockHeader>
			<BonusesEditor bonuses={auraLens.combine(bonusesLens).apply(aura)} />

			<BlockHeader>Triggered Effects</BlockHeader>
			<TriggeredEffectsEditor triggeredEffects={auraLens.combine(triggeredEffectsLens).apply(aura)} />
		</div>
	);
}
