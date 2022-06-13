import { FormInput } from 'src/components/form-input';
import { applyLens, ImmutableStateMutator } from 'src/components/form-input/hooks/useDocumentAsState';
import { Lens } from 'src/core/lens';
import { AttackEffect, DamageEffect, TextEffect } from '../dataSourceData';
import { DamageFields } from './DamageFields';

const hitDamageEffectLens = Lens.from<AttackEffect, DamageEffect | null>(
	(e) => e.hit.find((h): h is DamageEffect => h.type === 'damage') ?? null,
	(mutator) => (draft) => {
		const damageIndex = draft.hit.findIndex((h): h is DamageEffect => h.type === 'damage');
		const damageEffect = mutator((draft.hit[damageIndex] as DamageEffect) ?? null);
		console.log('new hit damageEffect', damageEffect);
		if (!damageEffect && damageIndex !== -1) {
			draft.hit.splice(damageIndex, 1);
			// half damage isn't allowed if no main damage
			draft.miss = draft.miss.filter((e) => e.type !== 'half-damage');
		} else if (damageIndex === -1 && damageEffect) {
			draft.hit.push(damageEffect);
			// two different damage dice codes aren't allowed
			draft.miss = draft.miss.filter((e) => e.type !== 'damage');
		} else if (damageEffect) draft.hit[damageIndex] = damageEffect;
	}
);

const missHalfDamageEffectLens = Lens.from<AttackEffect, boolean>(
	(e) => !!e.miss.find((h): h is DamageEffect => h.type === 'half-damage'),
	(mutator) => (draft) => {
		const hasHalfDamage = !!draft.miss.find((h): h is DamageEffect => h.type === 'half-damage');
		const halfDamage = mutator(hasHalfDamage);
		if (!halfDamage) draft.miss = draft.miss.filter((e) => e.type !== 'half-damage');
		else if (!hasHalfDamage) draft.miss.push({ type: 'half-damage' });
	}
);

const missDamageEffectLens = Lens.from<AttackEffect, DamageEffect | null>(
	(e) => e.miss.find((h): h is DamageEffect => h.type === 'damage') ?? null,
	(mutator) => (draft) => {
		const damageIndex = draft.miss.findIndex((h): h is DamageEffect => h.type === 'damage');
		const damageEffect = mutator((draft.miss[damageIndex] as DamageEffect) ?? null);
		if (!damageEffect && damageIndex !== -1) draft.miss.splice(damageIndex, 1);
		else if (damageIndex === -1 && damageEffect) draft.miss.push(damageEffect);
		else if (damageEffect) draft.miss[damageIndex] = damageEffect;
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

export function AttackEffectFields(props: ImmutableStateMutator<AttackEffect>) {
	const hitTextState = applyLens(props, hitTextLens);
	const hitDamageEffectState = applyLens(props, hitDamageEffectLens);
	return (
		<>
			<DamageFields {...hitDamageEffectState} />
			<div className="grid grid-cols-12 gap-x-1">
				<FormInput className="col-span-12">
					<FormInput.TextField {...hitTextState} />
					<FormInput.Label>Hit</FormInput.Label>
				</FormInput>
			</div>
			{hitDamageEffectState.value ? (
				<>
					<FormInput>
						{/* <FormInput.Checkbox {...applyLens(props, missHalfDamageEffectLens)} />  */} Half Damage on Miss?
					</FormInput>
				</>
			) : (
				<DamageFields prefix="Miss" {...applyLens(props, missDamageEffectLens)} />
			)}
		</>
	);
}
