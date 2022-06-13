import { FormInput, SelectItem } from 'src/components/form-input';
import { applyLens, ImmutableStateMutator } from 'src/components/form-input/hooks/useDocumentAsState';
import { Lens } from 'src/core/lens';
import { DamageTypes, DamageType } from 'src/types/types';
import { AttackEffect, DamageEffect, TextEffect } from './dataSourceData';

const damageDiceLens = Lens.from<AttackEffect, string>(
	(e) => e.hit.find((h): h is DamageEffect => h.type === 'damage')?.damage ?? '',
	(mutator) => (draft) => {
		const damageDraft = draft.hit.find((h): h is DamageEffect => h.type === 'damage');
		const damage = mutator(damageDraft?.damage ?? '');
		if (damageDraft && damage) damageDraft.damage = damage;
		else if (!damage) draft.hit = draft.hit.filter((h) => h.type !== 'damage');
		else draft.hit.push({ type: 'damage', damage, damageType: 'normal' });
	}
);
const damageTypeLens = Lens.from<AttackEffect, DamageType>(
	(e) => e.hit.find((h): h is DamageEffect => h.type === 'damage')?.damageType ?? 'normal',
	(mutator) => (draft) => {
		const damageDraft = draft.hit.find((h): h is DamageEffect => h.type === 'damage');
		const damageType = mutator(damageDraft?.damageType ?? 'normal');
		if (damageDraft) damageDraft.damageType = damageType;
		else draft.hit.push({ type: 'damage', damage: '1[W]', damageType });
	}
);

const hitTextLens = Lens.from<AttackEffect, string>(
	(e) => e.hit.find((h): h is TextEffect => h.type === 'text')?.text ?? '',
	(mutator) => (draft) => {
		const textDraft = draft.hit.find((h): h is TextEffect => h.type === 'text');
		const text = mutator(textDraft?.text ?? '');
		if (textDraft && text) textDraft.text = text;
		else if (!text) draft.hit = draft.hit.filter((h) => h.type !== 'text');
		else draft.hit.push({ type: 'text', text });
	}
);

const damageTypeOptions = DamageTypes.map(
	(dt): SelectItem<DamageType> => ({
		value: dt,
		key: dt,
		label: dt.capitalize(),
	})
);

export function AttackEffectFields(props: ImmutableStateMutator<AttackEffect>) {
	const hitTextState = applyLens(props, hitTextLens);
	const damageState = applyLens(props, damageDiceLens);
	const damageTypeState = applyLens(props, damageTypeLens);
	return (
		<div className="grid grid-cols-12 gap-x-1">
			<FormInput className="col-span-5">
				<FormInput.TextField {...damageState} />
				<FormInput.Label>Damage Dice</FormInput.Label>
			</FormInput>
			{damageState.value ? (
				<>
					<FormInput className="col-span-5">
						<FormInput.Select {...damageTypeState} options={damageTypeOptions} />
						<FormInput.Label>Damage Type</FormInput.Label>
					</FormInput>
					<div className="col-span-2">damage</div>
				</>
			) : (
				<></>
			)}
			<FormInput className="col-span-12">
				<FormInput.TextField {...hitTextState} />
				<FormInput.Label>Hit</FormInput.Label>
			</FormInput>
		</div>
	);
}
