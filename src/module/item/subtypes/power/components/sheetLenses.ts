import { Draft } from 'immer';
import { WritableDraft } from 'immer/dist/types/types-external';
import { SourceDataOf } from 'src/core/foundry';
import { Lens } from 'src/core/lens';
import { MashupPower } from '../config';
import { PowerEffect, AttackEffect, AttackRoll, TextEffect, ApplicableEffect, TargetEffect } from '../dataSourceData';

export const not =
	<T extends U, U>(f: (e: U) => e is T) =>
	(e: U): e is Exclude<T, U> =>
		!f(e);
export const or =
	<U, T extends U, S extends U>(f1: (e: U) => e is T, f2: (e: U) => e is S) =>
	(e: U): e is T | S =>
		f1(e) || f2(e);
export const isAttackEffect = (e: ApplicableEffect): e is AttackEffect => e.type === 'attack';
export const isTargetEffect = (e: ApplicableEffect): e is TargetEffect => e.type === 'target';
export const isTextEffect = (e: ApplicableEffect): e is TextEffect => e.type === 'text';
export const isNull = (e: any): e is null => e === null;

export const baseLens = Lens.identity<SourceDataOf<MashupPower>>();

const undefinedString = Lens.from<string | undefined, string>(
	(d) => d ?? '',
	(mutator) => (d) => mutator(d ?? '') || undefined
);

export const nameLens = baseLens.toField('name');
export const powerSourceDataLens = baseLens.toField('data');
export const powerTypeLens = powerSourceDataLens.toField('type');
export const powerFlavorTextLens = powerSourceDataLens.toField('flavorText');
export const powerUsageLens = powerSourceDataLens.toField('usage');
export const powerActionTypeLens = powerSourceDataLens.toField('actionType');
export const powerEffectTargetLens = powerSourceDataLens.toField('effect').toField('target');
export const powerRequirementLens = powerSourceDataLens.toField('requirement').combine(undefinedString);
export const powerPrerequisiteLens = powerSourceDataLens.toField('prerequisite').combine(undefinedString);

export const powerEffectLens = powerSourceDataLens.to<PowerEffect>(
	(data) => data.effect,
	(mutator) => (data) => {
		data.effect = mutator(
			data.effect ?? { typeAndRange: { type: 'melee', range: 'weapon' }, target: 'One creature', effects: [] }
		);
	}
);

export const typeAndRangeLens = powerEffectLens.toField('typeAndRange');

export const attackEffectLens = powerEffectLens.to<AttackEffect | null>(
	(power) => power.effects?.find(isAttackEffect) ?? null,
	(mutator) => (draft) => {
		draft.effects ??= [];
		const attackIndex = draft.effects.findIndex(isAttackEffect);
		const oldAttackEffect = (draft.effects[attackIndex] as WritableDraft<AttackEffect> | undefined) ?? null;
		const attackEffect = mutator(oldAttackEffect);
		if (!attackEffect) {
			draft.effects = draft.effects.filter(not(isAttackEffect));
			return;
		}
		if (attackIndex === -1) {
			draft.effects.unshift(attackEffect);
		} else {
			draft.effects[attackIndex] = attackEffect;
		}
	}
);

export const attackEffectRequiredLens = Lens.cast<AttackEffect | null, AttackEffect>();

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

export const effectTextLens = powerEffectLens.to<string>(
	(e) => e.effects.find(isTextEffect)?.text ?? '',
	(mutator) => (draft) => {
		const textDraft = draft.effects.find(isTextEffect);
		const text = mutator(textDraft?.text ?? '');
		if (textDraft && text) textDraft.text = text;
		else if (!text) draft.effects = draft.effects.filter(not(isTextEffect));
		else draft.effects.push({ type: 'text', text });
	}
);

type MaybeDraft<T, IsDraft extends boolean> =
	| (IsDraft extends false ? T : never)
	| (IsDraft extends true ? Draft<T> : never);

type AdditionalAttackInfo<IsDraft extends boolean> = {
	mustHit: boolean;
	attackContainer: MaybeDraft<ApplicableEffect[], IsDraft>;
	targetContainer: MaybeDraft<ApplicableEffect[], IsDraft>;
	attackIndex: number | null;
	targetIndex: number | null;
};

function findAdditionalAttack(
	power: Draft<PowerEffect>,
	additionalAttackIndex: 1 | 2
): AdditionalAttackInfo<true> | null;
function findAdditionalAttack(power: PowerEffect, additionalAttackIndex: 1 | 2): AdditionalAttackInfo<false> | null;
function findAdditionalAttack(
	power: Draft<PowerEffect> | PowerEffect,
	additionalAttackIndex: 1 | 2
): AdditionalAttackInfo<boolean> | null {
	const primaryAttack = power.effects.find(isAttackEffect) as AttackEffect | undefined;
	if (!primaryAttack) return null;

	const mustHit = !!primaryAttack.hit.find(or(isAttackEffect, isTargetEffect));
	if (mustHit) {
		// recurse in containers
		const result = findInside(primaryAttack.hit);
		if (additionalAttackIndex === 1) return result;
		if (additionalAttackIndex === 2 && result.attackIndex != null)
			return findInside((result.attackContainer[result.attackIndex] as AttackEffect).hit);
		return null;
	} else {
		const attackIndices = power.effects
			.map((e, index) => (or(isAttackEffect, isTargetEffect)(e) ? index : null))
			.filter((index): index is number => index !== null);
		if (attackIndices.length < additionalAttackIndex) return null; // no preceeding attack
		if (attackIndices.length <= additionalAttackIndex)
			// preceeding attack, but none at the correct index
			return {
				mustHit,
				targetContainer: power.effects,
				attackContainer: power.effects,
				attackIndex: null,
				targetIndex: null,
			};
		const current = power.effects[attackIndices[additionalAttackIndex]] as AttackEffect | TargetEffect;
		const targetContainer = power.effects;
		if (isAttackEffect(current)) {
			return {
				mustHit,
				targetContainer,
				attackContainer: targetContainer,
				attackIndex: attackIndices[additionalAttackIndex],
				targetIndex: null,
			};
		}
		const attackContainer = current.effects;
		const attackIndex = attackContainer.findIndex(isAttackEffect);
		return {
			mustHit,
			targetContainer,
			attackContainer,
			targetIndex: attackIndices[additionalAttackIndex],
			attackIndex: attackIndex === -1 ? null : attackIndex,
		};
	}

	function findInside(container: ApplicableEffect[]): AdditionalAttackInfo<false> {
		const targetContainer = container;
		const targetIndex = container.findIndex(or(isAttackEffect, isTargetEffect));
		if (targetIndex === -1) {
			return { mustHit, targetContainer, attackContainer: targetContainer, attackIndex: null, targetIndex: null };
		} else if (isAttackEffect(targetContainer[targetIndex])) {
			return {
				mustHit,
				targetContainer,
				attackContainer: targetContainer,
				attackIndex: targetIndex,
				targetIndex: null,
			};
		} else {
			const targetEffect = container[targetIndex] as TargetEffect;
			const attackIndex = targetEffect.effects.findIndex(isAttackEffect);
			return {
				mustHit,
				targetContainer,
				attackContainer: targetEffect.effects,
				attackIndex: attackIndex === -1 ? null : attackIndex,
				targetIndex,
			};
		}
	}
}

export function canHaveSecondaryAttack(power: PowerEffect) {
	return findAdditionalAttack(power, 1) !== null;
}

export const secondaryTargetLens = Lens.from<PowerEffect, TargetEffect | null>(
	(power) => {
		const info = findAdditionalAttack(power, 1);
		if (!info || info.targetIndex === null) return null;
		return info.targetContainer[info.targetIndex] as TargetEffect;
	},
	(mutator) => (power) => {
		const info = findAdditionalAttack(power, 1);
		if (!info) return;
		const oldTarget = info.targetIndex === null ? null : (info.targetContainer[info.targetIndex] as TargetEffect);
		const newTarget = mutator(oldTarget);
		console.log({ info, oldTarget, newTarget });
		if (newTarget && info.targetIndex !== null) {
			info.targetContainer[info.targetIndex] = newTarget;
		} else if (newTarget && !oldTarget && info.attackIndex !== null) {
			const attack = info.attackContainer[info.attackIndex] as AttackEffect;
			info.attackContainer.splice(info.attackIndex, 1);
			newTarget.effects.push(attack);
			info.targetContainer.push(newTarget);
		} else if (!newTarget && info.targetIndex !== null && info.attackIndex !== null) {
			const attack = info.attackContainer[info.attackIndex] as AttackEffect;
			info.targetContainer[info.targetIndex] = attack;
		} else if (!newTarget && info.targetIndex !== null) {
			info.targetContainer.splice(info.targetIndex, 1);
		}
	}
);

export const secondaryAttackLens = Lens.from<PowerEffect, AttackEffect | null>(
	(power) => {
		const additionalAttackInfo = findAdditionalAttack(power, 1);
		if (!additionalAttackInfo || additionalAttackInfo.attackIndex === null) return null;
		return additionalAttackInfo.attackContainer[additionalAttackInfo.attackIndex] as AttackEffect;
	},
	(mutator) => (power) => {
		const info = findAdditionalAttack(power, 1);
		if (!info) return;
		const oldAttack = info.attackIndex === null ? null : (info.attackContainer[info.attackIndex] as AttackEffect);
		const newAttack = mutator(oldAttack);
		if (newAttack && info.attackIndex !== null) {
			info.attackContainer[info.attackIndex] = newAttack;
		} else if (newAttack && info.attackIndex === null) {
			info.attackContainer.push(newAttack);
		} else if (!newAttack && info.attackIndex !== null) {
			info.attackContainer.splice(info.attackIndex, 1);
		}
	}
);

export const targetTextLens = Lens.from<TargetEffect | null, string>(
	(targetEffect) => {
		return targetEffect?.target ?? '';
	},
	(mutator) => (targetEffect) => {
		const target = mutator(targetEffect?.target ?? '');
		if (!target) return null;
		if (targetEffect) {
			targetEffect.target = target;
		} else {
			return { effects: [], target, type: 'target', typeAndRange: { type: 'same-as-primary' } };
		}
	}
);

export function canHaveTertiaryAttack(power: PowerEffect) {
	return findAdditionalAttack(power, 2) !== null;
}

export const tertiaryTargetLens = Lens.from<PowerEffect, TargetEffect | null>(
	(power) => {
		const info = findAdditionalAttack(power, 2);
		if (!info || info.targetIndex === null) return null;
		return info.targetContainer[info.targetIndex] as TargetEffect;
	},
	(mutator) => (power) => {
		const info = findAdditionalAttack(power, 2);
		if (!info) return;
		const oldTarget = info.targetIndex === null ? null : (info.targetContainer[info.targetIndex] as TargetEffect);
		const newTarget = mutator(oldTarget);
		console.log({ info, oldTarget, newTarget });
		if (newTarget && info.targetIndex !== null) {
			info.targetContainer[info.targetIndex] = newTarget;
		} else if (newTarget && !oldTarget && info.attackIndex !== null) {
			const attack = info.attackContainer[info.attackIndex] as AttackEffect;
			info.attackContainer.splice(info.attackIndex, 1);
			newTarget.effects.push(attack);
			info.targetContainer.push(newTarget);
		} else if (!newTarget && info.targetIndex !== null && info.attackIndex !== null) {
			const attack = info.attackContainer[info.attackIndex] as AttackEffect;
			info.targetContainer[info.targetIndex] = attack;
		} else if (!newTarget && info.targetIndex !== null) {
			info.targetContainer.splice(info.targetIndex, 1);
		}
	}
);

export const tertiaryAttackLens = Lens.from<PowerEffect, AttackEffect | null>(
	(power) => {
		const additionalAttackInfo = findAdditionalAttack(power, 2);
		if (!additionalAttackInfo || additionalAttackInfo.attackIndex === null) return null;
		return additionalAttackInfo.attackContainer[additionalAttackInfo.attackIndex] as AttackEffect;
	},
	(mutator) => (power) => {
		const info = findAdditionalAttack(power, 2);
		if (!info) return;
		const oldAttack = info.attackIndex === null ? null : (info.attackContainer[info.attackIndex] as AttackEffect);
		const newAttack = mutator(oldAttack);
		if (newAttack && info.attackIndex !== null) {
			info.attackContainer[info.attackIndex] = newAttack;
		} else if (newAttack && info.attackIndex === null) {
			info.attackContainer.push(newAttack);
		} else if (!newAttack && info.attackIndex !== null) {
			info.attackContainer.splice(info.attackIndex, 1);
		}
	}
);
