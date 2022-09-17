import classNames from 'classnames';
import { BlockHeader, FormInput, SelectItem } from '@foundryvtt-dndmashup/components';
import { Aura } from './types';
import { IconButton } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { useApplicationDispatcher } from '@foundryvtt-dndmashup/foundry-compat';
import { BonusesEditor } from '../bonuses';
import { ConditionSelector } from '../conditions/ConditionSelector';
import { TriggeredEffectsEditor } from '../effects/TriggeredEffectsEditor';
import { DispositionType } from './filterDisposition';

const baseLens = Lens.identity<Aura[]>();

const rangeLens = Lens.fromProp<Aura>()('range').combine(Lens.cast<string | number, string>());
const bonusesLens = Lens.fromProp<Aura>()('bonuses');
const triggeredEffectsLens = Lens.fromProp<Aura>()('triggeredEffects');
const conditionRuleLens = Lens.fromProp<Aura>()('condition');
const dispositionTypeLens = Lens.fromProp<Aura>()('dispositionType').default(null, (v): v is null => v === null);
const excludeSelfLens = Lens.fromProp<Aura>()('excludeSelf').default(false);

const dispositionTypeOptions: SelectItem<DispositionType | null>[] = [
	{ key: '', value: null, label: '(all)', typeaheadLabel: '(all)' },
	{ key: 'ally', value: 'ally', label: 'all allies', typeaheadLabel: 'all allies' },
	{ key: 'enemy', value: 'enemy', label: 'all enemies', typeaheadLabel: 'all enemies' },
	{ key: 'not allies', value: 'not allies', label: 'enemies and neutral', typeaheadLabel: 'enemies and neutral' },
	{ key: 'not enemies', value: 'not enemies', label: 'allies and neutral', typeaheadLabel: 'allies and neutral' },
	{ key: 'hostile', value: 'hostile', label: 'monsters', typeaheadLabel: 'monsters' },
	{ key: 'friendly', value: 'friendly', label: 'PCs', typeaheadLabel: 'PCs' },
];

export function AurasEditor({
	fallbackImage,
	auras,
	className,
}: {
	fallbackImage?: string | null;
	auras: Stateful<Aura[]>;
	className?: string;
}) {
	const apps = useApplicationDispatcher();

	function onAdd() {
		auras.onChangeValue((draft) => {
			draft.push({
				dispositionType: null,
				excludeSelf: false,
				range: auras.value[auras.value.length - 1]?.range ?? 1,
				condition: null,
				bonuses: [],
				triggeredEffects: [],
			});
			console.log(draft);
			return draft;
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
								<AuraDetails fallbackImage={fallbackImage} aura={baseLens.toField(idx).apply(auras)} />
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
								No auras
							</td>
						</tr>
					) : null}
				</tbody>
			</table>
		</div>
	);
}

const auraLens = Lens.identity<Aura>();

function AuraDetails({ aura, fallbackImage }: { aura: Stateful<Aura>; fallbackImage?: string | null }) {
	return (
		<div className="flex flex-col">
			<FormInput>
				<FormInput.TextField {...auraLens.combine(rangeLens).apply(aura)} className="text-center" />
				<FormInput.Label>Range</FormInput.Label>
			</FormInput>

			<FormInput.Inline>
				<FormInput.Checkbox {...auraLens.combine(excludeSelfLens).apply(aura)} />
				Aura excludes self?
			</FormInput.Inline>

			<FormInput>
				<FormInput.Select options={dispositionTypeOptions} {...auraLens.combine(dispositionTypeLens).apply(aura)} />
				<FormInput.Label>Disposition Type</FormInput.Label>
			</FormInput>

			<FormInput>
				<ConditionSelector {...auraLens.combine(conditionRuleLens).apply(aura)} />
				<FormInput.Label>Condition</FormInput.Label>
			</FormInput>

			<BlockHeader>Bonuses</BlockHeader>
			<BonusesEditor bonuses={auraLens.combine(bonusesLens).apply(aura)} />

			<BlockHeader>Triggered Effects</BlockHeader>
			<TriggeredEffectsEditor
				fallbackImage={fallbackImage}
				triggeredEffects={auraLens.combine(triggeredEffectsLens).apply(aura)}
			/>
		</div>
	);
}
