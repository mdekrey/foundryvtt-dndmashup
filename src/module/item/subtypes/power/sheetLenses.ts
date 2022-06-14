import { Draft } from 'immer';
import { WritableDraft } from 'immer/dist/types/types-external';
import { SourceDataOf } from 'src/core/foundry';
import { Lens } from 'src/core/lens';
import { MashupPower } from './config';
import {
	EffectTypeAndRange,
	PowerEffect,
	AttackEffect,
	AttackRoll,
	PowerDataSourceData,
	TextEffect,
} from './dataSourceData';

export const powerSourceDataLens = Lens.from<SourceDataOf<MashupPower>, PowerDataSourceData>(
	(power) => power.data,
	(mutator) => (power) => {
		power.data = mutator(power.data);
	}
);

export const powerEffectLens = powerSourceDataLens.to<PowerEffect>(
	(data) => data.effect,
	(mutator) => (data) => {
		data.effect = mutator(
			data.effect ?? { typeAndRange: { type: 'melee', range: 'weapon' }, target: 'One creature', effects: [] }
		);
	}
);

export const typeAndRangeLens = powerEffectLens.to<EffectTypeAndRange>(
	(power) => power.typeAndRange,
	(mutator) => (power) => {
		power.typeAndRange = mutator(power.typeAndRange);
	}
);

export const attackEffectLens = powerEffectLens.to<AttackEffect | null>(
	(power) => power.effects?.find((e): e is AttackEffect => e.type === 'attack') ?? null,
	(mutator) => (draft) => {
		draft.effects ??= [];
		const attackIndex = draft.effects.findIndex((e): e is Draft<AttackEffect> => e.type === 'attack');
		const oldAttackEffect = (draft.effects[attackIndex] as WritableDraft<AttackEffect> | undefined) ?? null;
		const attackEffect = mutator(oldAttackEffect);
		if (!attackEffect) {
			draft.effects = draft.effects.filter((e) => e.type !== 'attack');
			return;
		}
		if (attackIndex === -1) {
			draft.effects.unshift(attackEffect);
		} else {
			draft.effects[attackIndex] = attackEffect;
		}
	}
);

export const attackRollLens = Lens.from<AttackEffect | null, AttackRoll | null>(
	(attackEffect) => attackEffect?.attackRoll ?? null,
	(mutator) => (draft) => {
		const oldAttackRoll = draft?.attackRoll ?? null;
		const newAttackRoll = mutator(oldAttackRoll);
		if (!newAttackRoll) {
			return null;
		}
		const attackEffect = draft;
		if (attackEffect === null) {
			return { type: 'attack', attackRoll: newAttackRoll, hit: [], miss: [] };
		} else {
			attackEffect.attackRoll = newAttackRoll;
		}
	}
);

export const keywordsLens = Lens.from<SourceDataOf<MashupPower>, string>(
	(power) => power.data.keywords.map((k) => k.capitalize()).join(', '),
	(mutator) => (draft) => {
		const keywords = mutator(draft.data.keywords.map((k) => k.capitalize()).join(', '));
		draft.data.keywords = keywords
			.split(',')
			.map((k) => k.toLowerCase().trim())
			.filter((v) => v.length > 0);
	}
);

export const attackEffectRequiredLens = Lens.from<AttackEffect | null, AttackEffect>(
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	(attackEffect) => attackEffect!,
	(mutator) => (draft) => {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return mutator(draft!);
	}
);

export const effectTextLens = powerEffectLens.to<string>(
	(e) => e.effects.find((h): h is TextEffect => h.type === 'text')?.text ?? '',
	(mutator) => (draft) => {
		const textDraft = draft.effects.find((h): h is TextEffect => h.type === 'text');
		const text = mutator(textDraft?.text ?? '');
		if (textDraft && text) textDraft.text = text;
		else if (!text) draft.effects = draft.effects.filter((h) => h.type !== 'text');
		else draft.effects.push({ type: 'text', text });
	}
);
